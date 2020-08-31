import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { HomeComponent } from './views/home/home.component';

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
        path: 'home', 
        component: HomeComponent, 
        data: { title: 'Principal', breadcrumb: 'PRINCIPAL'}
      },
      { 
        path: 'analytics', 
        loadChildren: () => import('./views/dashboard/analytics.module').then(m => m.AnalyticsModule),
        data: { title: 'Analytics', breadcrumb: 'ANALYTICS'}
      },

      { 
        path: 'user', 
        loadChildren: () => import('./views/profile/user.module').then(m => m.AppUserModule),
        data: { title: 'Usuarios', breadcrumb: 'USUARIOS'}
      },

      { 
        path: 'settings', 
        loadChildren: () => import('./views/settings/settings.module').then(m => m.AppSettingsModule),
        data: { title: 'Configuración', breadcrumb: 'CONFIGURACIÓN'}
      },

      { 
        path: 'ticket', 
        loadChildren: () => import('./views/ticket/ticket.module').then(m => m.TicketModule),
        data: { title: 'Ticket', breadcrumb: 'TICKET'}
      },

      { 
        path: 'calendar', 
        loadChildren: () => import('./views/app-calendar/app-calendar.module').then(m => m.AppCalendarModule),
        data: { title: 'Calendario', breadcrumb: 'CALENDARIO'}
      },

      { 
        path: 'todo', 
        loadChildren: () => import('./views/todo/todo.module').then(m => m.TodoModule),
        data: { title: 'Tareas', breadcrumb: 'TAREAS'}
      },
    ]
  },
  { 
    path: '**', 
    redirectTo: 'sessions/404'
  }
];

