import { Component, OnInit} from '@angular/core';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Deposit } from 'app/shared/models/helpdesk/deposit/deposit';
import { stockService } from 'app/shared/services/helpdesk/deposit/stock.service';
import { Stock } from 'app/shared/models/helpdesk/deposit/stock';
import { depositService } from 'app/shared/services/helpdesk/deposit/deposit.service';
import { StockMinComponent } from './stockmin.component';

@Component({
  selector: 'app-stock-list',
  templateUrl: './list.component.html',
  providers: [userService, depositService, stockService]
})
export class StockListComponent implements OnInit {

  public token: string;
  public identity;
  rows = [];
  public columns = [];
  temp = [];

  public deposits: Deposit[];
  public deposit: Deposit;

  constructor(
    private _userService: userService,
    private _depositService: depositService,
    private _stockService: stockService,
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
  }

  getDeposits(){
    let query = {company: this.identity['company']['_id']};
    this._depositService.getList(this.token, query).subscribe(
      response =>{
          if(response.deposits){
            this.deposits = response.deposits;
            this.deposit = this.deposits[0];
            this.getStocks(this.deposit);
          }
      },
      error =>{
          this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  getStocks(deposit: Deposit){
    let query = {deposit: deposit._id};
    this._stockService.getList(this.token, query).subscribe(
      response =>{
          if(response.stocks){
            this.rows = response.stocks;
            this.temp = response.stocks;

            for (let i = 0; i < this.rows.length; i++) {
              const e = this.rows[i];
              this.rows[i]['article'] = e.item['name'] + ' ' + e.item['brand'];
              this.temp[i]['article'] = e.item['name'] + ' ' + e.item['brand'];
            }
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
        prop: 'article',
        name: 'Articulo',
        flexGrow: 3
      },
      {
        prop: 'cant',
        name: 'Stock',
        flexGrow: 1
      },
      {
        prop: 'cantMin',
        name: 'Stock minimo',
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

  openPopUp(event){
    if(event.type != 'click')
      return;

    let stock: Stock = event.row;

    let title = 'Editar stock mínimo';
    let dialogRef: MatDialogRef<any> = this.dialog.open(StockMinComponent, {
      width: '300px',
      data: { payload: stock, title:title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          return;
        }
        this.loader.open();
        let s: Stock = res.stock;

        this._stockService.edit(this.token, s._id, s).subscribe(
            response =>{
              if(response.stock){
                 stock.cantMin = s.cantMin;
              }
            },
            error =>{
              this.openSnackBar(error.message, 'Cerrar');
            }
        );
        this.loader.close();
      })
  }
}