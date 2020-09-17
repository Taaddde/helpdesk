import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Deposit } from 'app/shared/models/helpdesk/deposit/deposit';

@Component({
  selector: 'app-deposit-popop',
  templateUrl: './deposit.component.html',
}) 
export class DepositComponent implements OnInit {
  public deposit: Deposit;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DepositComponent>,
    private snackBar: MatSnackBar,

  ) {
    this.deposit = new Deposit('','',''); 
   }

  ngOnInit() {
    this.build(this.data.payload);
  }


  build(deposit){
    if(deposit){
      this.deposit = deposit;
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

    this.dialogRef.close({deposit: this.deposit})
  }

  check(): boolean{
    if(
      this.deposit.name == ''
      ){
      return false;
    }else{
      return true;
    }
  }
}
