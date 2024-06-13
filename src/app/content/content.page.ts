import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-content',
  templateUrl: './content.page.html',
  styleUrls: ['./content.page.scss'],
})
export class ContentPage {
  files: Observable<any[]>;
  location: any;

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private geolocation: Geolocation
  ) {
    this.files = this.db.list('files').valueChanges();
  }

  uploadFile(event: any) {
    const file = event.target.files[0];
    if (file.size > 5 * 1024 * 1024 || !['application/pdf', 'image/jpeg'].includes(file.type)) {
      alert('File must be a PDF or JPEG and less than 5MB');
      return;
    }

    const filePath = `uploads/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().subscribe(() => {
      fileRef.getDownloadURL().subscribe(url => {
        this.db.list('files').push({ name: file.name, url });
      });
    });
  }

  getLocation() {
    this.geolocation.getCurrentPosition().then((resp: any) => {
      this.location = {
        latitude: resp.coords.latitude,
        longitude: resp.coords.longitude
      };
      this.db.list('locations').push(this.location);
    }).catch((error: any) => {
      console.log('Error getting location', error);
    });
  }
}