import { Component, OnInit, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';


  interface error {
    line?: string;
    column?: string;
  }

  
  @Component({
    selector: "app-tracking-errors",
    templateUrl: "./errors.component.html",
    providers: [
      {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
      {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    ],
  })
  export class TrackingErrorsComponent implements OnInit {

    public errors: error[];
  
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<TrackingErrorsComponent>,
      private dialog: MatDialog,
    ) {
      this.errors = this.data.payload;
    }
  
    ngOnInit() {
      console.log(this.errors, this.data);
    }

}