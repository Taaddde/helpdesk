import { Routes } from '@angular/router';
import { SectorListComponent } from './list/sector-list.component';
import { CompanyProfileComponent } from './company/company.component';
import { TypesTicketComponent } from './type-subtype tickets/type.component';
import { SubTypeEditComponent } from './type-subtype tickets/subtype/subtype-edit.component';
import { SubTypeNewComponent } from './type-subtype tickets/subtype/subtype-new.component';


export const SettingsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list/sector',
        component: SectorListComponent,
        data: { title: 'Lista de sectores', breadcrumb: 'LISTA DE SECTORES' }
      },
      {
        path: 'company',
        component: CompanyProfileComponent,
        data: { title: 'Departamento', breadcrumb: 'DEPARTAMENTO' }
      },
      {
        path: 'ticket/types',
        component: TypesTicketComponent,
        data: { title: 'Tipos y subtipos de ticket', breadcrumb: 'TIPOS Y SUBTIPOS DE TICKETS' }
      },
      {
        path: 'ticket/subtype/:id',
        component: SubTypeEditComponent,
        data: { title: 'Subtipo de ticket', breadcrumb: 'SUBTIPO DE TICKET' }
      },
      {
        path: 'ticket/newsubtype/:id',
        component: SubTypeNewComponent,
        data: { title: 'Nuevo subtipo', breadcrumb: 'NUEVO SUBTIPO' }
      },
    ]
  }
];