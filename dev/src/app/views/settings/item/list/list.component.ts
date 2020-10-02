import { Component, OnInit} from '@angular/core';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Item } from 'app/shared/models/helpdesk/deposit/item';
import { ItemComponent } from '../pop-up/item.component';
import { itemService } from 'app/shared/services/helpdesk/deposit/item.service';
import { Deposit } from 'app/shared/models/helpdesk/deposit/deposit';
import { stockService } from 'app/shared/services/helpdesk/deposit/stock.service';
import { Stock } from 'app/shared/models/helpdesk/deposit/stock';

@Component({
  selector: 'app-deposit-list',
  templateUrl: './list.component.html',
  providers: [userService, itemService, stockService]
})
export class ItemListComponent implements OnInit {

  public token: string;
  public identity;
  rows = [];
  public columns = [];
  temp = [];

  public canCreate = false;

  constructor(
    private _userService: userService,
    private _itemService: itemService,
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
    this.getItems();

    if(this.identity['role'] == 'ROLE_ADMIN'){
      this.canCreate = true;
    }
  }

  getItems(){
    let query = {company: this.identity['company']['_id']};
    this._itemService.getList(this.token, query).subscribe(
      response =>{
          if(response.items){
            this.rows = response.items;
            this.temp = response.items;
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
        flexGrow: 2
      },
      {
        prop: 'brand',
        name: 'Marca',
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

  openPopUp(isNew?, item?){
    let title = isNew ? 'Nuevo deposito' : 'Editar deposito';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ItemComponent, {
      width: '720px',
      disableClose: false,
      data: { payload: item, title:title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
          let item = new Item('',res.item['name'], res.item['brand'], this.identity['company']['_id']);
          let deposits: Array<string> = res.deposits;
            this._itemService.add(this.token, item).subscribe(
                response =>{
                    if(response.item){
                        this.openSnackBar('Articulo creado', 'Cerrar');
                        this.getItems();


                        deposits.forEach(d => {
                          let stock = new Stock('',response.item._id, d, 0, 0, false);

                          this._stockService.add(this.token, stock).subscribe(
                              response =>{},
                              error =>{console.log(error);}
                          );

                        });


                    }
                },
                error =>{
                    this.openSnackBar(error.message, 'Cerrar');
                }
            )
          
        } else {

          this._itemService.edit(this.token, res.item['_id'], res.item).subscribe(
            response =>{
              if(response.item){
                this.openSnackBar('Arcitulo actualizado', 'Cerrar');
                this.getItems();


                let query = {item: res.item['_id']}
                this._stockService.getList(this.token, query).subscribe(
                    response =>{
                      if(response.stocks){
                        let oldStocks: Stock[] = response.stocks;
                        let deposits: Array<string> = res.deposits;

                        oldStocks.forEach(oldStock => {
                          let d = oldStock.deposit['_id'];
                          if(deposits.indexOf(d) != -1){
                            //EXISTIO ANTES Y EXISTE AHORA
                            deposits.splice(deposits.indexOf(d), 1);
                          }else{
                            //EXISTIÓ ANTES Y YA NO EXISTE
                            this._stockService.deleteMany(this.token, query).subscribe(
                                response =>{},
                                error =>{console.log(error)}
                            );
                          }
                        });

                        if(deposits.length != 0){
                          deposits.forEach(deposit => {
                            let stock = new Stock('', res.item['_id'], deposit, 0, 0, false);
                            this._stockService.add(this.token, stock).subscribe(
                                response =>{},
                                error =>{console.log(error)}
                            );
                          });
                        }
                      }
                    },
                    error =>{
                      console.log(error)
                    }
                );
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