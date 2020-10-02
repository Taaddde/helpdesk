import { Routes } from '@angular/router';
import {  ReasonListComponent } from './list/list.component';


export const ReasonRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ReasonListComponent,
        data: { title: 'Lista de razones', breadcrumb: 'LISTA DE RAZONES' }
      },
    ]
  }
];