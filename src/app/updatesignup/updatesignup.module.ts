import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { updatesignupPageRoutingModule } from './updatesignup-routing.module';

import { updatesignupPage } from './updatesignup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    updatesignupPageRoutingModule
  ],
  declarations: [updatesignupPage]
})
export class updatesignupPageModule {}
