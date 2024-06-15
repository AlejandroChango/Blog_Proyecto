import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { miblogService } from 'src/app/services/miblog.service';

@Component({
  selector: 'app-miblog',
  templateUrl: './miblog.page.html',
  styleUrls: ['./miblog.page.scss'],
})
export class miblogPage implements OnInit {
  miblog: any[] = [];
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  constructor(
    private miblogService: miblogService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadmiblog();
  }
  async loadmiblog() {
    try {
      // Utiliza el servicio para obtener los miblog del usuario actual
      this.miblogService.getmiblogsForCurrentUser().subscribe((miblog) => {
        this.miblog = miblog;
      });
    } catch (error) {
      this.presentAlert('Error al cargar los miblog');
    }
  }
  openGoogleMaps(latitude: number, longitude: number) {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  }
  eliminarmiblog(miblogoId: string) {
    this.miblogService
      .deletemiblog(miblogoId)
      .then(() => {
        this.presentAlert('Blog eliminado');
        // Vuelve a cargar la lista de miblog después de eliminar
        this.loadmiblog();
      })
      .catch((error) => {
        this.presentAlert('Error al eliminar el Blog');
      });
  }
  editarmiblog(miblogoId: string) {
    const ruta = '/dashboard/update-blog/' + miblogoId;
    this.router.navigateByUrl(ruta);
  }
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
