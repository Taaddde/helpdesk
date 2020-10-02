import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Deposit } from 'app/shared/models/helpdesk/deposit/deposit';
import { Item } from 'app/shared/models/helpdesk/deposit/item';
import { depositService } from 'app/shared/services/helpdesk/deposit/deposit.service';
import { stockService } from 'app/shared/services/helpdesk/deposit/stock.service';
import { userService } from 'app/shared/services/helpdesk/user.service';

@Component({
  selector: 'app-item-popop',
  templateUrl: './item.component.html',
  providers: [userService, depositService, stockService]
}) 
export class ItemComponent implements OnInit {
  public item: Item;
  public deposits: Deposit[];
  public depositsInclude: Array<string>;

  public token: string;
  public identity;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ItemComponent>,
    private snackBar: MatSnackBar,
    private _userService: userService,
    private _depositService: depositService,
    private _stockService: stockService
  ) {
    this.item = new Item('','','',''); 
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
   }

  ngOnInit() {
    this.build(this.data.payload);
    this.getDeposits();
  }

  getDeposits(){
    let query = {company: this.identity['company']['_id']};
    this._depositService.getList(this.token, query).subscribe(
        response =>{
          if(response.deposits){
            this.deposits = response.deposits;
            this.depositsInclude = new Array<string>();

            if(this.data.payload){
              this.deposits.forEach(deposit => {
                let query = {item: this.data.payload['_id'], deposit: deposit._id};
                this._stockService.getList(this.token, query).subscribe(
                    response =>{
                      if(response.stocks && response.stocks[0]){
                          this.depositsInclude.push(response.stocks[0]['deposit']['_id'])
                      }
                    },
                    error =>{
                      this.openSnackBar(error.message, 'Cerrar');
                    }
                );
              });
            }else{
              this.depositsInclude = new Array<string>();
              this.deposits.forEach(deposit => {
                this.depositsInclude.push(deposit._id);
              });
            }
             

          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }

  changeCheck(deposit: Deposit){
    if(this.depositsInclude.indexOf(deposit._id) == -1){
      this.depositsInclude.push(deposit._id);
    }else{
      this.depositsInclude.splice(this.depositsInclude.indexOf(deposit._id), 1);
    }
  }

  include(deposit: Deposit): boolean{
    if(this.depositsInclude.indexOf(deposit._id) != -1){
      return true;
    }else{
     return false;
    }
  }

  build(item){
    if(item){
      this.item = item;
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

    this.dialogRef.close({item: this.item, deposits: this.depositsInclude})
  }

  check(): boolean{
    if(
      this.item.name == ''
      ){
      return false;
    }else{
      return true;
    }
  }
}
