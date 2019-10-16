import {ModuleWithProviders} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { AgentTeamComponent } from './components/agent-team/agent-team.component';
import { AgentNewComponent } from './components/agent-new/agent-new.component';
import { AgentEditComponent } from './components/agent-new/agent-edit.component';
import { TeamNewComponent } from './components/team-new/team-new.component';
import { TeamEditComponent } from './components/team-new/team-edit.component';


const appRoutes: Routes = [
    //Redireccion
    //{path: '', redirectTo: 'home', pathMatch: 'full'},

    {path: 'ticket', component: TicketListComponent},
    {path: 'agent', component: AgentTeamComponent},

    {path: 'agent/new', component: AgentNewComponent},
    {path: 'agent/edit/:id', component: AgentEditComponent},

    {path: 'team/new', component: TeamNewComponent},
    {path: 'team/edit/:id', component: TeamEditComponent},


];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);