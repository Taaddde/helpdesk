import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
declare var $: any;
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sector } from 'app/shared/models/helpdesk/sector';
import { userService } from 'app/shared/services/helpdesk/user.service';

@Component({
  selector: 'app-sector-popop',
  templateUrl: './sector.component.html',
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    userService
  ],
})
export class SectorComponent implements OnInit {
  public sector: Sector;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SectorComponent>,
    private _userService: userService,
    private snackBar: MatSnackBar,

  ) {
    this.sector = new Sector('','','','');
   }

  ngOnInit() {
    this.buildSector(this.data.payload);
  }


  buildSector(sector){
    if(sector){
      this.sector = sector;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  submit() {
    if(!this.check()){
        return this.openSnackBar('Faltan campos para completar', 'Cerrar');
    }

    this.dialogRef.close({sector: this.sector})
  }

  check(): boolean{
    if(
      this.sector.name == '' || 
      this.sector.initials == '' || 
      this.sector.email == ''
      ){
      return false;
    }else{
      return true;
    }
  }
}
