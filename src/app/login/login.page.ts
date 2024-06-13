import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string;
  password: string;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.email = '';
    this.password = '';
  }

  async register() {
    try {
      const user = await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
      console.log(user);
      this.router.navigate(['/content']);
    } catch (error) {
      console.log(error);
    }
  }

  async login() {
    try {
      const user = await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      console.log(user);
      this.router.navigate(['/content']);
    } catch (error) {
      console.log(error);
    }
  }

  async loginWithGoogle() {
    try {
      const user = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      console.log(user);
      this.router.navigate(['/content']);
    } catch (error) {
      console.log(error);
    }
  }

  async resetPassword() {
    try {
      await this.afAuth.sendPasswordResetEmail(this.email);
      console.log('Password reset email sent');
    } catch (error) {
      console.log(error);
    }
  }
}