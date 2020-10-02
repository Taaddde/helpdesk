import { Routes } from '@angular/router';
import { EnableItemComponent } from './enable/enable.component';
import { ItemListComponent } from './list/list.component';
import { StockListComponent } from './stockmin/list.component';


export const ItemRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ItemListComponent,
        data: { title: 'Lista de articulos', breadcrumb: 'LISTA DE ARTICULOS' }
      },
      {
        path: 'enable',
        component: EnableItemComponent,
        data: { title: 'Habilitar articulos', breadcrumb: 'HABILITAR ARTICULOS' }
      },
      {
        path: 'stockmin',
        component: StockListComponent,
        data: { title: 'Stock mínimo', breadcrumb: 'STOCK MINIMO' }
      },
    ]
  }
];