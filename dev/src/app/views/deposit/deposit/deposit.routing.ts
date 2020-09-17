import { Routes } from '@angular/router';
import { DepositListComponent } from './list/list.component';


export const DepositRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: DepositListComponent,
        data: { title: 'Lista de depositos', breadcrumb: 'LISTA DE DEPOSITOS' }
      },
    ]
  }
];