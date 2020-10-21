import { Routes } from '@angular/router';
import { SectorListComponent } from './list/sector-list.component';
import { CompanyProfileComponent } from './company/company.component';
import { TypesTicketComponent } from './type-subtype tickets/type.component';
import { SubTypeEditComponent } from './type-subtype tickets/subtype/subtype-edit.component';
import { SubTypeNewComponent } from './type-subtype tickets/subtype/subtype-new.component';
import { PhoneListComponent } from './phone/phone/list.component';
import { PhoneGroupListComponent } from './phone/phonegroup/list.component';


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
        path: 'list/phonegroup',
        component: PhoneGroupListComponent,
        data: { title: 'Lista de grupos', breadcrumb: 'LISTA DE GRUPOS' }
      },
      {
        path: 'list/phone/:id',
        component: PhoneListComponent,
        data: { title: 'Lista de telefonos', breadcrumb: 'LISTA DE TELEFONOS' }
      },
      { 
        path: 'deposit', 
        loadChildren: () => import('./deposit/deposit.module').then(m => m.AppDepositModule),
        data: { title: 'Deposito', breadcrumb: 'DEPOSITO'}
      },
      { 
        path: 'item', 
        loadChildren: () => import('./item/item.module').then(m => m.AppItemModule),
        data: { title: 'Articulo', breadcrumb: 'ARTICULOS'}
      },
      { 
        path: 'reason', 
        loadChildren: () => import('./reason/reason.module').then(m => m.AppReasonModule),
        data: { title: 'Motivos', breadcrumb: 'MOTIVOS'}
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