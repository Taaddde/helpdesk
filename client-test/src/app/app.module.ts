import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import {routing, appRoutingProviders} from './app.routing';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { AgentTeamComponent } from './components/agent-team/agent-team.component';
import { AgentListComponent } from './components/agent-list/agent-list.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { AgentNewComponent } from './components/agent-new/agent-new.component';
import { AgentEditComponent } from './components/agent-new/agent-edit.component';
import { TeamNewComponent } from './components/team-new/team-new.component';
import { TeamEditComponent } from './components/team-new/team-edit.component';
import { TicketGestionComponent } from './components/ticket-gestion/ticket-gestion.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { TicketNewComponent } from './components/ticket-new/ticket-new.component';
import { HomeComponent } from './components/home/home.component';
import { ReportsComponent } from './components/reports/reports.component';
import { TicketReportComponent } from './components/ticket-report/ticket-report.component';
import { AgentReportComponent } from './components/agent-report/agent-report.component';

import { ChartModule } from 'angular2-chartjs';
import { ConfigComponent } from './components/config/config.component';
import { ResponsesComponent } from './components/responses/responses.component';
import { TypeSubtypeComponent } from './components/type-subtype/type-subtype.component';
import { TicketPortalComponent } from './components/ticket-portal/ticket-portal.component';
import { SearchListComponent } from './components/search-list/search-list.component';
import { CompanyComponent } from './components/company/company.component';

@NgModule({
  declarations: [
    AppComponent,
    TicketListComponent,
    AgentTeamComponent,
    AgentListComponent,
    TeamListComponent,
    AgentNewComponent,
    AgentEditComponent,
    TeamNewComponent,
    TeamEditComponent,
    TicketGestionComponent,
    ChatboxComponent,
    TicketNewComponent,
    HomeComponent,
    ReportsComponent,
    TicketReportComponent,
    AgentReportComponent,
    ConfigComponent,
    ResponsesComponent,
    TypeSubtypeComponent,
    TicketPortalComponent,
    SearchListComponent,
    CompanyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    ChartModule
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent],
})
export class AppModule { }