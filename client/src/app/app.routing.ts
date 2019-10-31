import {ModuleWithProviders} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'


import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { AgentTeamComponent } from './components/agent-team/agent-team.component';
import { AgentNewComponent } from './components/agent-new/agent-new.component';
import { AgentEditComponent } from './components/agent-new/agent-edit.component';
import { TeamNewComponent } from './components/team-new/team-new.component';
import { TeamEditComponent } from './components/team-new/team-edit.component';
import { TicketGestionComponent } from './components/ticket-gestion/ticket-gestion.component';
import { TicketNewComponent } from './components/ticket-new/ticket-new.component';
import { HomeComponent } from './components/home/home.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ConfigComponent } from './components/config/config.component';


const appRoutes: Routes = [
    //Redireccion
    {path: 'home', component: HomeComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},

    {path: 'ticket/:page/:perPage', component: TicketListComponent},
    {path: 'ticket/:page/:perPage/:status', component: TicketListComponent},
    {path: 'ticket/:page/:perPage/:status/:userId', component: TicketListComponent},
    { path: 'ticket', redirectTo: 'ticket/1/10', pathMatch: 'full' },
    { path: 'ticket/:page', redirectTo: 'ticket/1/10', pathMatch: 'full' },
    { path: 'ticket-gestion/:id', component: TicketGestionComponent},
    { path: 'ticket-new', component: TicketNewComponent},

    {path: 'agent', component: AgentTeamComponent},
    {path: 'agent/new', component: AgentNewComponent},
    {path: 'user/edit/:id', component: AgentEditComponent},

    {path: 'team/new', component: TeamNewComponent},
    {path: 'team/edit/:id', component: TeamEditComponent},

    {path: 'report', component: ReportsComponent},
    {path: 'config', component: ConfigComponent},

];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);