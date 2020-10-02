import { Routes } from '@angular/router';
import { MovimListComponent } from './list/list.component';
import { NewMovimComponent } from './new/new-movim.component';


export const MovimRoutes: Routes = [
  {
    path: '',
    children: [
      { 
        path: 'new', 
        component: NewMovimComponent,
        data: { title: 'Nuevo movimiento', breadcrumb: 'NUEVO MOVIMIENTO'}
      },
      { 
        path: 'list', 
        component: MovimListComponent,
        data: { title: 'Lista de movimientos', breadcrumb: 'LISTA DE MOVIMIENTOS'}
      },
    ]
  }
];