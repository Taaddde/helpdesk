import { Component, OnInit } from '@angular/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import esLocale from '@fullcalendar/core/locales/es';
import { userService } from 'src/app/services/user.service';
import { ticketService } from 'src/app/services/ticket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import * as moment from "moment"
import { workService } from 'src/app/services/work.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [userService, ticketService, workService]
})


export class CalendarComponent implements OnInit {

  public options;
  events: any[];
  
  public identity;
  public token;
  public url: string;
  public status: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _ticketService: ticketService,
    private _workService: workService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.events = [];

    this.status = 'tickets';
   }

  ngOnInit() {

    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      defaultDate: moment().format("YYYY-MM-DD"),
      header: {
          left: 'prev,next',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
      },
      editable: false,
      locale: esLocale,
      displayEventTime: false,
      height: 410,
    };
    this.getCalendarTickets()

  }

  getCalendarTickets(){
    this._ticketService.getCalendar(this.token, this.identity['_id']).subscribe(
      response =>{
          if(response.tickets){
            var flag = false;

            for (let i = 0; i < response.tickets.length; i++) {
              const e = response.tickets[i];
              if(e.resolveDate != 'null'){

                if(!flag){
                  this.events =[
                    {
                      "title": e.sub,
                      "start": moment(e.resolveDate, "DD-MM-YYYY").format(),
                      url: 'ticket-gestion/'+e._id,
                      "id": e._id,
                    }
                  ]
                  flag = true;
                }else{
                  this.events.push({
                    "title": e.sub,
                      "start": moment(e.resolveDate, "DD-MM-YYYY").format(),
                      url: 'ticket-gestion/'+e._id,
                      "id": e._id
                  })
                }
              }
            }
            
            
          }
      },
      error =>{
        console.error(error);
      }
    );
  }

  getCalendarTasks(){
    this._workService.getCalendar(this.token, this.identity['_id']).subscribe(
      response =>{
        var flag = false;

          if(response.works){
            for (let i = 0; i < response.works.length; i++) {
              const e = response.works[i];
              if(e.dateLimit != 'null'){
                if(!flag){
                  this.events =[
                    {
                      "title": e.name,
                      "start": moment(e.dateLimit, "YYYY-MM-DD").format(),
                      url: 'tasks',
                      "id": e._id,
                      color:'purple'

                    }
                  ]
                  flag = true;
                }else{
                  this.events.push({
                    "title": e.name,
                    "start": moment(e.dateLimit, "YYYY-MM-DD").format(),
                    url: 'tasks',
                    "id": e._id,
                    color:'purple'
                })
                }
              }
            }
          }
      },
      error =>{
        console.error(error);
      }
    );
  }


  changeStatus(){
    if(this.status == 'tickets'){
      this.status = 'tasks';
      this.getCalendarTasks();
    }else{
      this.getCalendarTickets();
      this.status = 'tickets';
    }
  }
}
