import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { newblogPage } from './new-blog.page';

const routes: Routes = [
  {
    path: '',
    component: newblogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class  newblogPageRoutingModule {}
