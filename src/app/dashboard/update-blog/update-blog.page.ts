import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { miblogService } from 'src/app/services/miblog.service';
import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-update-blog',
  templateUrl: './update-blog.page.html',
  styleUrls: ['./update-blog.page.scss'],
})
export class updateblogPage implements OnInit {
  miblog: any = {};
  miblogId: any;
  selectedFile: Photo | null = null;
  selectedUploadFile: File | null | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private miblogService: miblogService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.miblogId = params.get('id');
      if (this.miblogId) {
        this.loadmiblog(this.miblogId);
      } else {
        this.presentAlert('ID de blog no válido');
      }
    });
  }

  async loadmiblog(miblogId: string) {
    this.miblogService.getmiblogById(miblogId).subscribe(
      (miblog) => {
        // Asegúrate de que el miblog no sea null antes de asignarlo
        if (miblog) {
          this.miblog = miblog;
        } else {
          this.presentAlert('blog no encontrado');
        }
      },
      (error) => {
        this.presentAlert('Error al cargar el blog: ' + error);
      }
    );
  }

  async guardarCambios() {
    if (this.miblog.userId) {
      try {
        // Sube la nueva foto a Firebase Storage si hay una seleccionada
        let newPhotoUrl: string | undefined;
        if (this.selectedFile) {
          const imageString = await this.toBase64(this.selectedFile);
          const imagePath = `miblog-images/${this.miblog.userId}/${this.miblog.blog}`;
          const imageUploadTask = this.storage
            .ref(imagePath)
            .putString(imageString, 'data_url');
          const imageUrl = await from(imageUploadTask).toPromise();
          newPhotoUrl = await imageUrl?.ref.getDownloadURL();
          if (this.selectedUploadFile) {
            const filePath = `miblog-files/${this.miblog.userId}/${this.miblog.blog}`;
            const fileRef = this.storage.ref(filePath);
            const task = fileRef.put(this.selectedUploadFile);
            const attachedFileDownloadUrl = await from(task).toPromise().then((snapshot) => snapshot?.ref.getDownloadURL());

            this.miblog.attachedFileDownloadUrl = attachedFileDownloadUrl;
          }
        }

        // Obtén la posición geográfica antes de actualizar el miblog
        const position = await this.getCurrentPosition();

        // Actualiza la geolocalización en el objeto miblog
        this.miblog.geolocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Actualiza la URL de la foto si hay una nueva
        if (newPhotoUrl) {
          this.miblog.downloadUrl = newPhotoUrl;
        }

        // Actualiza el miblog en la base de datos
        await this.miblogService.updatemiblog(this.miblogId, this.miblog);

        this.presentAlert('Blog actualizado correctamente');
        this.router.navigate(['/dashboard/miblog']);
      } catch (error) {
        this.presentAlert('Error al actualizar el Blog: ' + error);
      }
    } else {
      this.presentAlert('ID del Blog no válido');
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
  async getCurrentPosition(): Promise<GeolocationPosition> {
    // Utiliza Capacitor Geolocation para obtener la posición actual
    const position = await Geolocation.getCurrentPosition();
    return position;
  }
  async takePhoto() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      allowEditing: true,
      quality: 100,
    });
    this.selectedFile = photo;
  }

  async selectFromGallery() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 100,
    });
    this.selectedFile = photo;
  }
  async onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.item(0);
    this.selectedUploadFile = file;
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