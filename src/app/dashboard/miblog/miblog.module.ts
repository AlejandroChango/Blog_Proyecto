import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { miblogPageRoutingModule } from './miblog-routing.module';
import { miblogPage } from './miblog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    miblogPageRoutingModule
  ],
  declarations: [miblogPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class miblogPageModule {}
