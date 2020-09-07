import { Routes } from '@angular/router';
import { TicketListComponent } from '../ticket/list/ticket-list.component'
import { TicketGestionComponent } from './gestion/gestion.component';
import { NewTicketComponent } from './new/new-ticket.component';

export const TicketRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list/:page/:limit',
        component: TicketListComponent,
        data: { title: 'Lista', breadcrumb: 'LISTA' }
      },
      {
        path: 'gestion/:id',
        component: TicketGestionComponent,
        data: { title: 'Gestión', breadcrumb: 'GESTION' }
      },
      {
        path: 'new',
        component: NewTicketComponent,
        data: { title: 'Nuevo', breadcrumb: 'NUEVO' }
      },
    ]
  }
];