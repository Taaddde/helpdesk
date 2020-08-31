import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EgretCalendarEvent } from '../../../shared/models/event.model';
import { ColorPickerControl, ColorsTable } from '@iplab/ngx-color-picker';
import { teamService } from 'app/shared/services/helpdesk/team.service';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { Team } from 'app/shared/models/helpdesk/team';

interface DialogData {
  event?: CalendarEvent,
  action?: string,
  date?: Date
}

@Component({
  selector: 'app-calendar-form-dialog',
  templateUrl: './calendar-form-dialog.component.html',
  styleUrls: ['./calendar-form-dialog.component.scss'],
  providers: [teamService]

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
    private _userService: userService
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
    this.dialogRef.close(this.event)
  }
 

}
