import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Reason } from 'app/shared/models/helpdesk/deposit/reason';

@Component({
  selector: 'app-reason-popop',
  templateUrl: './reason.component.html',
}) 
export class ReasonComponent implements OnInit {
  public reason: Reason;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReasonComponent>,
    private snackBar: MatSnackBar,

  ) {
    this.reason = new Reason('','','Ingreso',''); 
   }

  ngOnInit() {
    this.build(this.data.payload);
  }


  build(reason){
    if(reason){
      this.reason = reason;
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

    this.dialogRef.close({reason: this.reason})
  }

  check(): boolean{
    if(
      this.reason.name == ''
      ){
      return false;
    }else{
      return true;
    }
  }
}
