import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-updatesignup',
  templateUrl: './updatesignup.page.html',
  styleUrls: ['./updatesignup.page.scss'],
})
export class updatesignupPage { // Cambia el nombre de la clase a PascalCase
  user = {
    email: '',
  };

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertController: AlertController
  ) {}

  async onResetPassword() {
    try {
      const { email } = this.user;
      await this.afAuth.sendPasswordResetEmail(email);
      this.presentAlert('Se ha enviado un correo para restablecer la contraseña.');
      this.router.navigate(['/home']);
    } catch (error: any) {
      let errorMessage = 'Error al enviar el correo de restablecimiento.';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado. Por favor, regístrate.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo que has ingresado es incorrecto';
          break;
        default:
          break;
      }

      this.presentAlert(errorMessage);
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Información',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}