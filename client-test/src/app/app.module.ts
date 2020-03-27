import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {FullCalendarModule} from 'primeng/fullcalendar';

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
import { CalendarComponent } from './components/calendar/calendar.component';
import { RequesterNewComponent } from './components/agent-new/requester-new.component';
import { PassForgotComponent } from './components/pass-forgot/pass-forgot.component';
import { PassResetComponent } from './components/pass-reset/pass-reset.component';
import { MyHttpInterceptor } from './services/myhttpinterceptor';
import { RequesterListComponent } from './components/agent-list/request-list.component';
import { TimeworkListComponent } from './components/timework-list/timework-list.component';
import { TimeworkSubtypeListComponent } from './components/timework-subtype-list/timework-subtype-list.component';
import { AgentTimeReportComponent } from './components/agent-report/agent-time-report.component';
import { MessageComponent } from './components/message/message.component';
import { SectorListComponent } from './components/sector-list/sector-list.component';
import { NewsComponent } from './components/news/news.component';
import { SectorNewComponent } from './components/sector-new/sector-new.component';
import { ChatComponent } from './components/chat/chat.component';

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
    CompanyComponent,
    CalendarComponent,
    RequesterNewComponent,
    PassForgotComponent,
    PassResetComponent,
    RequesterListComponent,
    TimeworkListComponent,
    TimeworkSubtypeListComponent,
    AgentTimeReportComponent,
    MessageComponent,
    SectorListComponent,
    NewsComponent,
    SectorNewComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    routing,
    ChartModule,
    FullCalendarModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [
    appRoutingProviders,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyHttpInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
