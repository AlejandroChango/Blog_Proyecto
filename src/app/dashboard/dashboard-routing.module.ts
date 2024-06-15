import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '', // Ruta vacía para redirigir a 'dashboard/contact'
    redirectTo: 'miblog',
    pathMatch: 'full',
  },
  {
    path: '',

    component: DashboardPage,
    children: [
      {
        path: 'miblog',
        loadChildren: () =>
          import('./miblog/miblog.module').then((m) => m.miblogPageModule),
      },
      {
        path: 'new-blog',
        loadChildren: () =>
          import('./new-blog/new-blog.module').then(
            (m) => m.newblogPageModule
          ),
      },
      {
        path: 'update-blog/:id',
        loadChildren: () =>
          import('./update-blog/update-blog.module').then(
            (m) => m.updateblogPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
