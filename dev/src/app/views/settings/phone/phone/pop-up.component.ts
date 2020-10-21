import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Phone } from 'app/shared/models/helpdesk/phone';
import { phoneService } from 'app/shared/services/helpdesk/phone.service';

@Component({
  selector: 'app-phone-popop',
  templateUrl: './pop-up.component.html',
  providers: [phoneService]
}) 
export class PhoneComponent implements OnInit {
  public phone: Phone;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PhoneComponent>,
    private snackBar: MatSnackBar,
    private _phoneService: phoneService,
  ) {
    this.phone = new Phone('','','',null, 2); 
   }

  ngOnInit() {
    this.build(this.data.payload);
  }

  build(item){
    if(item){
      this.phone = item;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  submit(b: boolean) {
    if(!this.check()){
        return this.openSnackBar('Faltan campos para completar', 'Cerrar');
    }

    if(b){
      this.dialogRef.close({phone: this.phone})
    }else{
      if(this.phone._id != '')
        this.dialogRef.close({delete: true});
    }
  }

  check(): boolean{
    if(
      this.phone.name == null
      ){
      return false;
    }else{
      return true;
    }
  }
}
