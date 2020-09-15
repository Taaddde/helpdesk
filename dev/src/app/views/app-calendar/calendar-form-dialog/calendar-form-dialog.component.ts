import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EgretCalendarEvent } from '../../../shared/models/event.model';
import { ColorPickerControl, ColorsTable } from '@iplab/ngx-color-picker';
import { teamService } from 'app/shared/services/helpdesk/team.service';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { Team } from 'app/shared/models/helpdesk/team';
import { APP_DATE_FORMATS, AppDateAdapter } from 'app/shared/services/date-adapter';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface DialogData {
  event?: CalendarEvent,
  action?: string,
  date?: Date
}

@Component({
  selector: 'app-calendar-form-dialog',
  templateUrl: './calendar-form-dialog.component.html',
  styleUrls: ['./calendar-form-dialog.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    teamService
  ]

})
export class CalendarFormDialogComponent implements OnInit {
  event: CalendarEvent;
  dialogTitle: string;
  eventForm: FormGroup;
  action: string;
  public compactControl = new ColorPickerControl();

  public token: string;
  public identity;

  public teams: Team[];

  constructor(
    public dialogRef: MatDialogRef<CalendarFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private formBuilder: FormBuilder,
    private _teamService: teamService,
    private _userService: userService,
    private snackBar: MatSnackBar,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
    this.event = data.event;
    this.action = data.action;
    
    if (this.action === 'edit') {
      this.dialogTitle = this.event.title;
    } else {
      this.dialogTitle = 'Añadir evento';
      this.event = new EgretCalendarEvent({
        start: data.date,
        end: data.date,
        user: this.identity['_id']
      });
    }
    this.eventForm = this.buildEventForm(this.event);
  }

  ngOnInit() {
    this.getTeams();
  }

  getTeams(){
    this._teamService.getList(this.token,this.identity['company']['_id']).subscribe(
      response =>{
          if(response.teams){
            this.teams = response.teams;
          }
      },
    );
  }

  buildEventForm(event: EgretCalendarEvent) {
    return new FormGroup({
      _id: new FormControl(event._id),
      title: new FormControl(event.title),
      start: new FormControl(event.start),
      end: new FormControl(event.end),
      allDay: new FormControl(event.allDay),
      color: this.formBuilder.group({
        primary: new FormControl(event.color.primary),
        secondary: new FormControl(event.color.secondary)
      }),
      meta: this.formBuilder.group({
        location: new FormControl(event.meta.location),
        notes: new FormControl(event.meta.notes)
      }),
      type: new FormControl(event.type)
    });
  }

  send(){
    if(this.event.title != '' && (this.event.type == 'Privado' || (this.event.type == 'Público' && this.event['team']))){
      this.dialogRef.close(this.event)
    }else{
      this.openSnackBar('Faltan completar datos', 'Cerrar');
    }
  }
 
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

}
