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

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [userService, ticketService]
})


export class CalendarComponent implements OnInit {

  public options;
  events: any[];
  
  public identity;
  public token;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _ticketService: ticketService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.events = [];
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

    this.getCalendar()
  }

  getCalendar(){
    this._ticketService.getCalendar(this.token, this.identity['_id']).subscribe(
      response =>{
          if(!response.tickets){
          }else{

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
                      "id": e._id
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
        console.log(error);
      }
    );
  }
}
