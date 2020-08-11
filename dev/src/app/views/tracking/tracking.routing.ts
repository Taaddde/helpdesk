import { Routes } from '@angular/router';
import { TrackingListComponent } from './list/tracking-list.component';
import { TrackingAnalyticsComponent } from './analytics/analytics.component';
import { TrackingImportComponent } from './import/import.component';


export const TrackingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'analytics',
        component: TrackingAnalyticsComponent,
        data: { title: 'Analytics', breadcrumb: 'ANALYTICS' }
      },
      {
        path: 'list',
        component: TrackingListComponent,
        data: { title: 'Listado', breadcrumb: 'LISTADO' }
      },
      {
        path: 'import',
        component: TrackingImportComponent,
        data: { title: 'Importación', breadcrumb: 'IMPORTACIÓN' }
      },
    ]
  }
];