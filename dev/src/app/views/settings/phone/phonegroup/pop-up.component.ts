import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PhoneGroup } from 'app/shared/models/helpdesk/phonegroup';

@Component({
  selector: 'app-phonegroup-popop',
  templateUrl: './pop-up.component.html',
}) 
export class PhoneGroupComponent implements OnInit {
  public phoneGroup: PhoneGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PhoneGroupComponent>,
    private snackBar: MatSnackBar,
  ) {
    this.phoneGroup = new PhoneGroup('','',''); 
   }

  ngOnInit() {
    this.build(this.data.payload);
  }

  build(item){
    if(item){
      this.phoneGroup = item;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  submit(b: boolean) {
    if(!this.check())
        return this.openSnackBar('Faltan campos para completar', 'Cerrar');

    if(b){
      this.dialogRef.close({phoneGroup: this.phoneGroup})
    }else{
      if(this.phoneGroup._id != '')
        this.dialogRef.close({delete: true});
    }
  }

  check(): boolean{
    if(
      this.phoneGroup.name == '' ||
      this.phoneGroup.branch == ''
      ){
      return false;
    }else{
      return true;
    }
  }
}
