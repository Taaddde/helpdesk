import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stock } from 'app/shared/models/helpdesk/deposit/stock';

@Component({
  selector: 'app-stockmin-popop',
  templateUrl: './stockmin.component.html',
}) 
export class StockMinComponent implements OnInit {
  public stock: Stock;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<StockMinComponent>,
  ){
  }

  ngOnInit(){
    this.build(this.data.payload)
  }

  build(item){
    if(item){
      this.stock = item;
    }
  }

  submit() {
    this.dialogRef.close({stock: this.stock})
  }

}
