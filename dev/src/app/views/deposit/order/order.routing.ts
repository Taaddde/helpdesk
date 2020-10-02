import { Routes } from '@angular/router';
import { NewOrderComponent } from './new/new-order.component';
import { OrderDetailComponent } from './new/order.component';


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
    ]
  }
];