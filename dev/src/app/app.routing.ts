import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const rootRouterConfig: Routes = [
  { 
    path: '', 
    redirectTo: 'sessions/signin', 
    pathMatch: 'full' 
  },
  {
    path: '', 
    component: AuthLayoutComponent,
    children: [
      { 
        path: 'sessions', 
        loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule),
        data: { title: 'Session'} 
      }
    ]
  },
  {
    path: '', 
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      
      {
        path: 'tracking', 
        loadChildren: () => import('./views/tracking/tracking.module').then(m => m.AppTrackingModule), 
        data: { title: 'Tracking', breadcrumb: 'TRACKING'}
      },
      { 
        path: 'analytics', 
        loadChildren: () => import('./views/dashboard/analytics.module').then(m => m.AnalyticsModule),
        data: { title: 'Analytics', breadcrumb: 'ANALYTICS'}
      },



      { 
        path: 'ticket', 
        loadChildren: () => import('./views/ticket/ticket.module').then(m => m.TicketModule),
        data: { title: 'Ticket', breadcrumb: 'TICKET'}
      }
    ]
  },
  { 
    path: '**', 
    redirectTo: 'sessions/404'
  }
];

