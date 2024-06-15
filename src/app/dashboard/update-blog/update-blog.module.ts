import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { updateblogPageRoutingModule } from './update-blog-routing.module';

import { updateblogPage } from './update-blog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    updateblogPageRoutingModule
  ],
  declarations: [updateblogPage]
})
export class updateblogPageModule {}
