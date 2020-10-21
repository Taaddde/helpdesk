import { Routes } from '@angular/router';
import { OrderListComponent } from './list/list-order.component';
import { NewOrderComponent } from './new/new-order.component';
import { OrderDetailComponent } from './new/order.component';
import { ReceiveOrderComponent } from './receive/receive-order.component';


export const OrderRoutes: Routes = [
  {
    path: '',
    children: [
      { 
        path: 'new', 
        component: NewOrderComponent,
        data: { title: 'Nueva orden', breadcrumb: 'NUEVA ORDEN'}
      },
      { 
        path: 'get/:id', 
        component: OrderDetailComponent,
        data: { title: 'Orden', breadcrumb: 'ORDEN'}
      },
      { 
        path: 'list', 
        component: OrderListComponent,
        data: { title: 'Orden', breadcrumb: 'ORDEN'}
      },
      { 
        path: 'receive/:id', 
        component: ReceiveOrderComponent,
        data: { title: 'Recibir pedido', breadcrumb: 'RECIBIR PEDIDO'}
      },
    ]
  }
];