import { Component, OnInit} from '@angular/core';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { depositService } from 'app/shared/services/helpdesk/deposit/deposit.service';
import { DepositComponent } from '../pop-up/deposit.component';
import { Deposit } from 'app/shared/models/helpdesk/deposit/deposit';

@Component({
  selector: 'app-deposit-list',
  templateUrl: './list.component.html',
  providers: [userService, depositService]
})
export class DepositListComponent implements OnInit {

  public token: string;
  public identity;
  rows = [];
  public columns = [];
  temp = [];

  public canCreate = false;

  constructor(
    private _userService: userService,
    private _depositService: depositService,
    private loader: AppLoaderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
  }

  ngOnInit() {
    this.getColumns();
    this.getDeposits();

    if(this.identity['role'] == 'ROLE_ADMIN'){
      this.canCreate = true;
    }
  }

  getDeposits(){
    let query = {company: this.identity['company']['_id']};
    this._depositService.getList(this.token, query).subscribe(
      response =>{
          if(response.deposits){
            this.rows = response.deposits;
            this.temp = response.deposits;
          }
      },
      error =>{
          this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  getColumns(){
    this.columns = [
      {
        prop: 'name',
        name: 'Nombre',
        flexGrow: 1
      }
    ];
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    var columns = Object.keys(this.temp[0]);
    // Removes last "$$index" from "column"
    columns.splice(columns.length - 1);

    // console.log(columns);
    if (!columns.length)
      return;

    const rows = this.temp.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        let column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });

    this.rows = rows;

  }

  toNew() {
    this.openPopUp(true);
  }

  openPopUp(isNew?, deposit?){
    let title = isNew ? 'Nuevo deposito' : 'Editar deposito';
    let dialogRef: MatDialogRef<any> = this.dialog.open(DepositComponent, {
      width: '720px',
      disableClose: false,
      data: { payload: deposit, title:title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
          let deposit = new Deposit('',res.deposit['name'], this.identity['company']['_id']);
            this._depositService.add(this.token, deposit).subscribe(
                response =>{
                    if(response.deposit){
                        this.openSnackBar('Deposito creado', 'Cerrar');
                        this.getDeposits();
                    }
                },
                error =>{
                    this.openSnackBar(error.message, 'Cerrar');
                }
            )
          
        } else {

          this._depositService.edit(this.token, res.deposit['_id'], res.deposit).subscribe(
            response =>{
              if(response.deposit){
                this.openSnackBar('Deposito actualizado', 'Cerrar');
                this.getDeposits();
              }
            },
            error =>{
              this.openSnackBar(error.message, 'Cerrar');
            }
          )
        }
        this.loader.close();
      })
  }

  toProfile(event, isNew?) {
    if(event.type != 'click'){
        return;
    }
    if(this.canCreate){
      this.openPopUp(false, event.row);
    }
    
  }

}