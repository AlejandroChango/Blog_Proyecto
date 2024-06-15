import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { newblogPageRoutingModule } from './new-blog-routing.module';

import { newblogPage } from './new-blog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    newblogPageRoutingModule
  ],
  declarations: [newblogPage]
})
export class newblogPageModule {}
