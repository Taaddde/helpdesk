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
    ChatboxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
