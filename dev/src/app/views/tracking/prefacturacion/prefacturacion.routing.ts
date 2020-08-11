import { Routes } from '@angular/router';
import { CarpetaComponent } from './carpeta/carpeta.component';


export const PrefacturacionRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'carpeta',
        component: CarpetaComponent,
        data: { title: 'Carpetas', breadcrumb: 'CARPETAS' }
      },
    ]
  }
];