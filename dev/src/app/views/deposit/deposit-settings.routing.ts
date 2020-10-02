import { Routes } from '@angular/router';
import { DepositAnalyticsComponent } from './home/analytics.component';


export const DepositSettingsRoutes: Routes = [
  {
    path: '',
    children: [
      { 
        path: 'movim', 
        loadChildren: () => import('./movim/movim.module').then(m => m.AppMovimModule),
        data: { title: 'Movimientos', breadcrumb: 'MOVIMIENTOS'}
      },
      { 
        path: 'order', 
        loadChildren: () => import('./order/order.module').then(m => m.AppOrderModule),
        data: { title: 'Ordenes', breadcrumb: 'ORDENES'}
      },
      { 
        path: 'home', 
        component: DepositAnalyticsComponent,
        data: { title: 'Principal', breadcrumb: 'PRINCIPAL'}
      },
    ]
  }
];