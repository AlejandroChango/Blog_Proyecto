import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, from } from 'rxjs';
import { map,switchMap } from 'rxjs/operators';
import { GeolocationPosition } from '@capacitor/geolocation';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class miblogService {
  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {}

  async createmiblog(
    blog: string,
    nombreblog: string,
    geolocation: GeolocationPosition,
    imageFile: Photo | null,
    attachedFile: File | null
  ): Promise<any> {
    try {
      const user = await this.afAuth.currentUser;
      if (!user) {
        throw new Error('Usuario no autenticado');
      }
      const miblogsCollection: AngularFirestoreCollection<any> = this.firestore.collection('miblogs');
  
      const existingmiblogs = await miblogsCollection.ref
        .where('userId', '==', user.uid)
        .where('blog', '==', blog)
        .where('nombreblog', '==', nombreblog)
        .get();
  
      if (!existingmiblogs.empty) {
        // Ya existe un blog con la misma información
        throw new Error('Este blog ya existe.');
      }
  
      let downloadUrl = null;
      if (imageFile) {
        const imageString = await this.toBase64(imageFile);
        const imagePath = `miblog-images/${user.uid}/${blog}`;
        const imageUploadTask = this.storage
          .ref(imagePath)
          .putString(imageString, 'data_url');
        const imageUrl = await from(imageUploadTask).toPromise();
        downloadUrl = await imageUrl?.ref.getDownloadURL();
      }
  
      let attachedFileDownloadUrl = null;
      if (attachedFile) {
        const attachedFilePath = `miblog-files/${user.uid}/${attachedFile.name}`;
        const attachedFileUploadTask = this.storage.ref(attachedFilePath).put(attachedFile);
        const attachedFileUrl = await from(attachedFileUploadTask).toPromise();
        attachedFileDownloadUrl = await attachedFileUrl?.ref.getDownloadURL();
      }
  
      const miblogData = {
        blog,
        nombreblog,
        userId: user.uid,
        geolocation: {
          latitude: geolocation.coords.latitude,
          longitude: geolocation.coords.longitude,
        },
        downloadUrl,
        attachedFileDownloadUrl,
      };
  
      const result = await this.firestore
        .collection('miblogs')
        .add(miblogData);
  
      return result;
    } catch (error) {
      throw error;
    }
  }

  getmiblogsForCurrentUser(): Observable<any[]> {
    return this.afAuth.user.pipe(
      // Utilizamos switchMap para cambiar a un nuevo observable
      switchMap((user) => {
        if (!user) {
          throw new Error('Usuario no autenticado');
        }

        // Devolvemos el observable directamente
        return this.firestore
          .collection('miblogs', (ref) => ref.where('userId', '==', user.uid))
          .snapshotChanges()
          .pipe(
            map((snaps) => {
              return snaps.map((snap) => {
                const data = snap.payload.doc.data() as { [key: string]: any };
                const id = snap.payload.doc.id;
                return { id, ...data };
              });
            })
          );
      })
    );
  }
  deletemiblog(miblogId: string) {
    return this.firestore.collection('miblogs').doc(miblogId).delete();
  }
  updatemiblog(miblogId: string, updatedmiblog: any) {
    return this.firestore
      .collection('miblogs')
      .doc(miblogId)
      .update(updatedmiblog);
  }
  getmiblogById(miblogId: string): Observable<any> {
    return new Observable((observer) => {
      this.afAuth.currentUser.then((user) => {
        if (user) {
          const miblogRef = this.firestore
            .collection('miblogs')
            .doc(miblogId);
          miblogRef.get().subscribe(
            (doc) => {
              if (doc.exists) {
                const miblogData = doc.data();
                observer.next(miblogData);
              } else {
                observer.error('blog no encontrado');
              }
            },
            (error) => {
              observer.error(error);
            }
          );
        }
      });
    });
  }

  private async toBase64(image: Photo): Promise<string> {
    try {
      if (!image || !image.webPath) {
        throw new Error('Image path is undefined or null');
      }

      const response = await fetch(image.webPath);

      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const blob = await response.blob();

      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {

      throw error;
    }
  }
}
