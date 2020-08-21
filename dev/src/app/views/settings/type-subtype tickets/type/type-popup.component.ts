import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
declare var $: any;
import { MatSnackBar } from '@angular/material/snack-bar';
import { TypeTicket } from 'app/shared/models/helpdesk/typeticket';

@Component({
  selector: 'app-type-popup',
  templateUrl: './type-popup.component.html',
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class TypePopupComponent implements OnInit {

    public type: TypeTicket;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TypePopupComponent>,
  ){
    this.type = new TypeTicket('','','');
  }

    ngOnInit() {
        this.build(this.data.payload);
    }

    build(type){
        if(type){
            this.type = type;
        }
    }
    
    submit(){
        this.dialogRef.close({type: this.type});
    }
}
