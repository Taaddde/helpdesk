import { Routes } from '@angular/router';
import { ItemListComponent } from './list/list.component';


export const ItemRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ItemListComponent,
        data: { title: 'Lista de articulos', breadcrumb: 'LISTA DE ARTICULOS' }
      },
    ]
  }
];