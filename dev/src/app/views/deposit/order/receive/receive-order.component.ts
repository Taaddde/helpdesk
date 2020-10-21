import { Component, OnInit } from '@angular/core';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import * as moment from "moment"
import { orderService } from 'app/shared/services/helpdesk/deposit/order.service';
import { orderItemService } from 'app/shared/services/helpdesk/deposit/orderitem.service';
import { Order } from 'app/shared/models/helpdesk/deposit/order';
import { OrderItem } from 'app/shared/models/helpdesk/deposit/orderitem';
import { Stock } from 'app/shared/models/helpdesk/deposit/stock';
import { stockService } from 'app/shared/services/helpdesk/deposit/stock.service';
import { Item } from 'app/shared/models/helpdesk/deposit/item';
import { depositService } from 'app/shared/services/helpdesk/deposit/deposit.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { Deposit } from 'app/shared/models/helpdesk/deposit/deposit';
import { movimService } from 'app/shared/services/helpdesk/deposit/movim.service';
import { Movim } from 'app/shared/models/helpdesk/deposit/movim';

@Component({
  selector: 'app-receive-order',
  templateUrl: './receive-order.component.html',
  providers: [orderService, orderItemService, stockService, depositService, movimService]
})

export class ReceiveOrderComponent implements OnInit {
  public token: string;
  public identity;

  public order: Order;
  public orderItems: OrderItem[];

  public deposits: Deposit[];
  public deposit: Deposit;

  public stocks: Stock[];

  constructor(
    private _userService: userService,
    private snackBar: MatSnackBar,
    private _router: Router,
    private loader: AppLoaderService,
    private dialog: MatDialog,
    private confirmService: AppConfirmService,
    private _route: ActivatedRoute,
    private _movimService: movimService,

    private _orderService: orderService,
    private _orderItemService: orderItemService,
    private _stockService: stockService,
    private _depositService: depositService,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();

    this.order = new Order('',null,new Date(),new Date(),null,this.identity['company']['_id'],null,'','','No creado');
  }

  ngOnInit() {
    this.order.dateRequired.setMonth(this.order.dateRequired.getMonth() + 1);

    this.getDeposits();
    this.getOrders();
    this.getStocks();
  }

  getStocks(){
    this._stockService.getList(this.token, {}).subscribe(
        response =>{
          if(response.stocks){
            this.stocks = response.stocks;
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }


  getDeposits(){
    let query = {company: this.identity['company']['_id']};
    this._depositService.getList(this.token, query).subscribe(
        response =>{
          if(response.deposits){
            this.deposits = response.deposits;
            this.deposit = this.deposits[0];
          }
        },
        error =>{
          console.error(error);
        }
    );
  }

  getOrders(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];

      this._orderService.getOne(this.token, id).subscribe(
          response =>{
            if(response.order){
               this.order = response.order;

               this._orderItemService.getList(this.token, {order: this.order._id}).subscribe(
                   response =>{
                     if(response.orderItems){
                        this.orderItems = response.orderItems;
                        this.orderItems.forEach(e => {
                          e['cantReceived2'] = e.cantReceived;
                        });
                     }
                   },
                   error =>{
                     this.openSnackBar(error.message, 'Cerrar');
                   }
               );

            }else{
              this.openSnackBar('Orden no encontrada', 'Cerrar');
              this._router.navigate(['deposit/home']);
            }
          },
          error =>{
            this._router.navigate(['deposit/home']);
            this.openSnackBar(error.message, 'Cerrar');
          }
      );
      
    })
  }


  getLenght(arr: any): number{
    return arr.length;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  send(){

    let flag = true;
    let allClean = true;
    let itemsOut = '';

    this.orderItems.forEach(e => {
      if(e.cant-e.cantReceived < 0 || e.cant < e.cant-e.cantReceived)
        flag = false;

      if(e.cantReceived-e['cantReceived2'] > 0 && !this.existStock(e.item['_id'], this.deposit._id))
        itemsOut = itemsOut + e.item['name'] + ' ' + e.item['brand'] + ', ';

      if(e.cant-e.cantReceived > 0)
        allClean = false;
    });

    if(!flag)
      return this.openSnackBar('Hay valores que no coinciden en lo que se recibe.', 'Cerrar');

    if(itemsOut != '')
      return this.openSnackBar('Los siguientes items no estan habilitados en el depósito: '+itemsOut+'verificar.', 'Cerrar');
  
    if(itemsOut == '' && flag){
      this.orderItems.forEach(e => {
        if(e.cantReceived-e['cantReceived2'] > 0){
          let update = {cantReceived: e.cantReceived};
          this._orderItemService.edit(this.token, e._id, update).subscribe(
            response =>{
              if(response.orderItem){
                setTimeout( () => { 
                  this.addMovim(e);
                }, Math.random()*1000)

                let full = false;
                if(e.cant == e.cantReceived)
                  full = true;
                this.editStock(e.item['_id'], this.deposit._id, e.cantReceived-e['cantReceived2'], full);
              }
            },
            error =>{this.openSnackBar(error.message, 'Cerrar');}
          );
        }
      });
    }

    if(allClean){
      let update = {status: 'Recibido'};

      this._orderService.edit(this.token, this.order._id, update).subscribe(
          response =>{},
          error =>{this.openSnackBar(error.message, 'Cerrar');}
      );
    }

    this.openSnackBar('Movimiento realizado correctamente', 'Cerrar');
    this._router.navigate(['deposit/order/list']);

  }

  addMovim(order: OrderItem){
    let movim = new Movim(
      '',
      null,
      'Pedido', 
      this.deposit._id,
      order.item['_id'], 
      this.identity['company']['_id'],
      order.cantReceived - order['cantReceived2'],
      this.identity['_id'],
      null,
      new Date(),
      new Date(),
      null,
      null,
      null,
      null,
      ''
    )

    this._movimService.add(this.token, movim).subscribe(
        response =>{},
        error =>{this.openSnackBar(error.message, 'Cerrar');}
    );

  }

  editStock(item, deposit, cant, full:boolean){
    let update: any = {$inc: {cant: cant}};
    if(full)
      update['onOrder'] = false;
    let index = this.stocks.findIndex(function(e){ 
      return e.deposit['_id'] == deposit && e.item['_id'] == item; 
    });

    let stock: Stock = this.stocks[index];

    this._stockService.edit(this.token, stock._id, update).subscribe(
        response =>{},
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }

  existStock(item, deposit): boolean{
    let index = this.stocks.findIndex(function(e){ 
      return e.deposit['_id'] == deposit && e.item['_id'] == item; 
    });

    if(index == -1)
      return false;
    else
      return true;
  }
}


