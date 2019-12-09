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
import { SearchListComponent } from './components/search-list/search-list.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { RequesterNewComponent } from './components/agent-new/requester-new.component';
import { PassResetComponent } from './components/pass-reset/pass-reset.component';
import { TimeworkListComponent } from './components/timework-list/timework-list.component';


const appRoutes: Routes = [
    //Redireccion
    {path: 'home', component: HomeComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'reset-password/:id/:passToken', component: PassResetComponent},

    {path: 'ticket/:page/:perPage', component: TicketListComponent},
    {path: 'ticket/:page/:perPage/:status', component: TicketListComponent},
    {path: 'ticket/:page/:perPage/:status/:userId', component: TicketListComponent},
    { path: 'ticket', redirectTo: 'ticket/1/10', pathMatch: 'full' },
    { path: 'ticket/:page', redirectTo: 'ticket/1/10', pathMatch: 'full' },
    { path: 'ticket-gestion/:id', component: TicketGestionComponent},
    { path: 'ticket-new', component: TicketNewComponent},

    {path: 'agent/:back', component: AgentTeamComponent},
    {path: 'agent', component: AgentTeamComponent},
    {path: 'agents/new', component: AgentNewComponent},
    {path: 'user/edit/:id', component: AgentEditComponent},

    {path: 'requester/new', component: RequesterNewComponent},

    {path: 'team/new', component: TeamNewComponent},
    {path: 'team/edit/:id', component: TeamEditComponent},

    {path: 'report', component: ReportsComponent},
    {path: 'config', component: ConfigComponent},

    {path: 'search/:stat/:q', component: SearchListComponent},

    {path: 'calendar', component: CalendarComponent},

    {path: 'timework', component: TimeworkListComponent},


];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);