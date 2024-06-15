import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { miblogPage } from './miblog.page';

const routes: Routes = [
  {
    path: '',
    component: miblogPage

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class miblogPageRoutingModule {}
