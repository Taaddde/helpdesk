import { Routes } from '@angular/router';
import { RequesterListComponent } from './list/requester-list.component';
import { UserProfileComponent } from './profile/profile.component';
import { AgentListComponent } from './list/agent-list.component';
import { TeamListComponent } from './list/team-list.component';
import { TeamProfileComponent } from './team/team.component';
import { NewUserComponent } from './profile/new.component';
import { NewTeamComponent } from './team/new.component';


export const UserRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list/requester',
        component: RequesterListComponent,
        data: { title: 'Lista de solicitantes', breadcrumb: 'LISTA DE SOLICITANTES' }
      },
      {
        path: 'list/agent',
        component: AgentListComponent,
        data: { title: 'Lista de agentes', breadcrumb: 'LISTA DE AGENTES' }
      },
      {
        path: 'list/team',
        component: TeamListComponent,
        data: { title: 'Lista de equipos', breadcrumb: 'LISTA DE EQUIPOS' }
      },
      {
        path: 'team/profile/:id',
        component: TeamProfileComponent,
        data: { title: 'Perfil de equipo', breadcrumb: 'PERFIL DE EQUIPO' }
      },
      {
        path: 'profile/:id',
        component: UserProfileComponent,
        data: { title: 'Perfil de usuario', breadcrumb: 'PERFIL DE USUARIO' }
      },
      {
        path: 'new/:type',
        component: NewUserComponent,
        data: { title: 'Nuevo usuario', breadcrumb: 'NUEVO USUARIO' }
      },
      {
        path: 'team/new', 
        component: NewTeamComponent,
        data: { title: 'Nuevo equipo', breadcrumb: 'NUEVO EQUIPO' }
      },
    ]
  }
];