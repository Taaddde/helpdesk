import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  isSameDay,
  isSameMonth
} from 'date-fns';
import { egretAnimations } from "../../shared/animations/egret-animations";
import { EgretCalendarEvent } from '../../shared/models/event.model';
import { AppCalendarService } from './app-calendar.service';
import { CalendarFormDialogComponent } from './calendar-form-dialog/calendar-form-dialog.component';
import { AppConfirmService } from '../../shared/services/app-confirm/app-confirm.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { calendarEventService } from 'app/shared/services/helpdesk/calendarEvent.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { teamService } from 'app/shared/services/helpdesk/team.service';
import { notificationService } from 'app/shared/services/helpdesk/notification.service';
import { Notification } from 'app/shared/models/helpdesk/notification';
import * as moment from 'moment';
import { Team } from 'app/shared/models/helpdesk/team';
import { User } from 'app/shared/models/helpdesk/user';

registerLocaleData(localeEs);
@Component({
  selector: 'app-calendar',
  templateUrl: './app-calendar.component.html',
  styleUrls: ['./app-calendar.component.css'],
  animations: egretAnimations,
  providers: [teamService, notificationService]
})
export class AppCalendarComponent implements OnInit {
  public view = 'month';
  public viewDate = new Date();
  private dialogRef: MatDialogRef<CalendarFormDialogComponent>;
  public activeDayIsOpen: boolean = true;
  public refresh: Subject<any> = new Subject();
  public events: EgretCalendarEvent[];
  private actions: CalendarEventAction[];

  public token: string;
  public identity;
  public teams: string[];

  public query = {};
  constructor(
    public dialog: MatDialog,
    private calendarService: AppCalendarService,
    private confirmService: AppConfirmService,
    private _userService: userService,
    private _teamService: teamService,
    private _notificationService: notificationService,
    private _calendarEventService: calendarEventService,
    private snackBar: MatSnackBar,
  ) {
    this.actions = [{
      label: '<i class="material-icons icon-sm">edit</i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('edit', event);
      }
    }, {
      label: '<i class="material-icons icon-sm">close</i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.removeEvent(event);
      }
    }];

    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
    this.teams = new Array();
  }

  ngOnInit() {
    this.loadEvents();
    this.getUserTeams();
  }

  getUserTeams(){
    this._teamService.getTeamsOfUser(this.token,this.identity['_id']).subscribe(
      response =>{
          if(response.teams){
            response.teams.forEach(e => {
              this.teams.push(e._id)
            });
          }
      },
    );
  }

  private initEvents(events): EgretCalendarEvent[] {
    
    return events.map(event => {
      event.actions = this.actions;
      event.user = this.identity['_id'];

      return new EgretCalendarEvent(event);
    });
  }

  public loadEvents() {
    if(this.query['type']){
      if(this.query['type'] == 'Privado'){
        delete this.query['team'];
        this.query['user'] = this.identity['_id']
      }else{
        delete this.query['user'];
        this.query['team'] = this.teams;
      }
    }
    this._calendarEventService.getList(this.token, this.query).subscribe(
      response =>{
          if(response.calendarEvents){
            this.events = this.initEvents(response.calendarEvents);
          }
      },
      error =>{
          this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  public removeEvent(event) {
    this.confirmService.confirm({
        message: '¿Eliminar evento?',
      })
      .subscribe(res => {
        if (!res) {
          return;
        }

        this._calendarEventService.delete(this.token, event._id).subscribe(
          response =>{
              if(response.calendarEvent){
                this.deleteNotification(response.calendarEvent);

                this.loadEvents();
                this.openSnackBar('Evento eliminado', 'Cerrar');
              }
          },
          error =>{
              this.openSnackBar(error.message, 'Cerrar');
          }
        );
      })
  }

  public clearQuery(val){
    delete this.query[val];
  }

  public addEvent() {
    this.dialogRef = this.dialog.open(CalendarFormDialogComponent, {
      panelClass: 'calendar-form-dialog',
      data: {
        action: 'add',
        date: new Date()
      },
      width: '500px'
    });
    this.dialogRef.afterClosed()
      .subscribe((res) => {
        if (!res) {
          return;
        }
        let dialogAction = res.action;
        let responseEvent = res.event;
        if(responseEvent.title != '' && (responseEvent.type == 'Privado' || (responseEvent.type == 'Público' && responseEvent['team']))){
          this._calendarEventService.add(this.token, responseEvent).subscribe(
            response =>{
                if(response.calendarEvent){
                  this.saveNotification(response.calendarEvent);
  
                  this.loadEvents();
                  this.openSnackBar('Evento añadido', 'Cerrar');
                }
            },
            error =>{
                this.openSnackBar(error.message, 'Cerrar');
            }
          );
        }else{
          return this.openSnackBar('Faltan completar datos', 'Cerrar');
        }
    
        
      });
  }

  saveNotification(calendarEvent){
    let notification: Notification;
    let start = moment(calendarEvent.start).format('YYYY-MM-DD HH:mm');
    let title = calendarEvent.title;
    let event = calendarEvent._id;
    if(calendarEvent.type == 'Privado'){
      notification = new Notification('',title, 'event', start, start, 'calendar', 'accent', this.identity['_id'], event, null);
      notification.event = event;
      this._notificationService.add(this.token, notification).subscribe(
        response =>{
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
      );
    }else{
      this._teamService.getOne(this.token, calendarEvent.team).subscribe(
          response =>{
            if(response.team){
              let team: Team = response.team;
              let users = response.team.users;
              users.forEach(user => {
                notification = new Notification('',title, 'event', start, start, 'calendar', 'accent', user, event, null);
                notification.event = event;
                this._notificationService.add(this.token, notification).subscribe(
                    response =>{},
                    error =>{
                      this.openSnackBar(error.message, 'Cerrar');
                    }
                );
              });
            }
          },
          error =>{
            this.openSnackBar(error.message, 'Cerrar');
          }
      );
    }
  }

  editNotification(calendarEvent){
    let start = moment(calendarEvent.start).format('YYYY-MM-DD HH:mm');
    let title = calendarEvent.title;
    let event = calendarEvent._id;
    let query = {event: event};

    this._notificationService.getList(this.token, query).subscribe(
        response =>{
          if(response.notifications){
            let notifications: Notification[] = response.notifications;

            notifications.forEach(notification => {
              notification.date = start;
              notification.dateInit = start;
              notification.message = title;
              this._notificationService.edit(this.token, notification._id, notification).subscribe(
                response =>{},
                error =>{
                  this.openSnackBar(error.message, 'Cerrar');
                }
              );
            });

          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }


  deleteNotification(calendarEvent){
    let event = calendarEvent._id;
    let query = {event: event};

    this._notificationService.getList(this.token, query).subscribe(
        response =>{
          if(response.notifications){
            let notifications: Notification[] = response.notifications;

            notifications.forEach(notification => {
              this._notificationService.delete(this.token, notification._id).subscribe(
                response =>{},
                error =>{
                  this.openSnackBar(error.message, 'Cerrar');
                }
              );
            });

          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }

  public handleEvent(action: string, event: EgretCalendarEvent): void {
    // console.log(event)
    this.dialogRef = this.dialog.open(CalendarFormDialogComponent, {
      panelClass: 'calendar-form-dialog',
      data: { event, action },
      width: '500px'
    });

    this.dialogRef
      .afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        let dialogAction = res.action;
        let responseEvent = res.event;

        if (dialogAction === 'save') {
          this.editEvent(responseEvent);
        } else if (dialogAction === 'delete') {
          this.removeEvent(event);
        }

      })
  }

  editEvent(event){
    this._calendarEventService.edit(this.token, event._id, event).subscribe(
      response =>{
          if(response.calendarEvent){
            this.editNotification(event);
            this.loadEvents();
            this.openSnackBar('Evento editado', 'Cerrar');
          }
      },
      error =>{
          this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }


  public dayClicked({ date, events }: { date: Date, events: CalendarEvent[] }): void {

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  public eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;

    this.editEvent(event);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }
}
