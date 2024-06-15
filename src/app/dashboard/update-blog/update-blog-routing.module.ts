import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { updateblogPage } from './update-blog.page';

const routes: Routes = [
  {
    path: '',
    component: updateblogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class updateblogPageRoutingModule {}
