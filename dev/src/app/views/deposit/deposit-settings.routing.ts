import { Routes } from '@angular/router';


export const DepositSettingsRoutes: Routes = [
  {
    path: '',
    children: [
      { 
        path: 'deposit', 
        loadChildren: () => import('./deposit/deposit.module').then(m => m.AppDepositModule),
        data: { title: 'Deposito', breadcrumb: 'DEPOSITO'}
      },
      { 
        path: 'item', 
        loadChildren: () => import('./item/item.module').then(m => m.AppItemModule),
        data: { title: 'Articulo', breadcrumb: 'ARTICULO'}
      },
    ]
  }
];