import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { miblogService } from 'src/app/services/miblog.service';
import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-blog',
  templateUrl: './new-blog.page.html',
  styleUrls: ['./new-blog.page.scss'],
})
export class newblogPage implements OnInit {
  cuerpoBlog: string = '';
  nombreBlog: string = '';
  contactPhoneNumber: string = '';
  selectedFile: Photo | null = null;
  selectedUploadFile: File | null = null;
  enviarUbicacion: boolean = false;

  constructor(
    private router: Router,
    private miblogService: miblogService,
    private alertController: AlertController,
    private platform: Platform
  ) {}

  ngOnInit() {
    Camera.requestPermissions();
  }

  async createnewblog() {
    try {
      let position: GeolocationPosition = {
        coords: {
          latitude: 0,
          longitude: 0,
          accuracy: 0,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null
        },
        timestamp: Date.now()
      };

      if (this.enviarUbicacion) {
        position = await this.getCurrentPosition();
      }

      if (this.selectedUploadFile && this.selectedUploadFile.size > 5 * 1024 * 1024) {
        throw new Error('El archivo no debe superar los 5 MB.');
      }

      await this.miblogService.createmiblog(
        this.nombreBlog,
        this.cuerpoBlog,
        position,
        this.selectedFile as Photo, // Aseguramos que no sea null
        this.selectedUploadFile as File // Aseguramos que no sea null
      );

      this.clearFormData();
      this.router.navigate(['/dashboard/miblog']);
      this.presentAlert('Éxito', 'El Blog se creó correctamente.');
    } catch (error: any) {
      this.presentAlert('Error', error.toString());
    }
  }

  async getCurrentPosition(): Promise<GeolocationPosition> {
    const position: GeolocationPosition = await Geolocation.getCurrentPosition();
    return position;
  }

  clearFormData() {
    this.cuerpoBlog = '';
    this.nombreBlog = '';
    this.selectedFile = null;
    this.selectedUploadFile = null;
    this.enviarUbicacion = false;
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'image/jpeg')) {
      this.selectedUploadFile = file;
    } else {
      this.presentAlert('Error', 'Solo se permiten archivos PDF o JPEG.');
    }
  }
}