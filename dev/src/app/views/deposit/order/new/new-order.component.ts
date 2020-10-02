import { Component, OnInit } from '@angular/core';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { Router } from '@angular/router';
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
import { itemService } from 'app/shared/services/helpdesk/deposit/item.service';
import { Sector } from 'app/shared/models/helpdesk/sector';
import { sectorService } from 'app/shared/services/helpdesk/sector.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/shared/services/date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OrderItemPopUpComponent } from './item/pop-up.component';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    orderService, orderItemService, stockService, depositService, itemService, sectorService
  ]
})
export class NewOrderComponent implements OnInit {
  public token: string;
  public identity;
  public config = GLOBAL.richTextModule;

  public order: Order;
  public orderItems: OrderItem[];
  public orderItem: OrderItem;

  public lowStocks: Stock[];

  public items: Item[];
  public tmpItems: Item[] = [];

  public sectors: Sector[];
  public tmpSectors: Sector[] = [];

  constructor(
    private _userService: userService,
    private snackBar: MatSnackBar,
    private _router: Router,
    private loader: AppLoaderService,
    private dialog: MatDialog,

    private _orderService: orderService,
    private _orderItemService: orderItemService,
    private _stockService: stockService,
    private _depositService: depositService,
    private _sectorService: sectorService
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();

    this.order = new Order('',null,new Date(),new Date(),null,this.identity['company']['_id'],null,'','','Pendiente');

    this.orderItem = new OrderItem('', '', null, 1, '', '', '');
  }

  ngOnInit() {
    this.order.dateRequired.setMonth(this.order.dateRequired.getMonth() + 1);

    this.getDeposits();
    this.getSectors();
  }

  getSectors(){
    this._sectorService.getList(this.token).subscribe(
        response =>{
          if(response.sectors){
             this.sectors = response.sectors;
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
            let depositsIds = new Array<string>();
            response.deposits.forEach(e => {
              depositsIds.push(e._id);
            });
            this.getStockMissing(depositsIds);
          }
        },
        error =>{
          console.error(error);
        }
    );
  }

  getStockMissing(depositIds: Array<String>){
    let query = { deposit: depositIds, onOrder:false, $where: "this.cant < this.cantMin"};
    this._stockService.getList(this.token, query).subscribe(
        response =>{
          if(response.stocks){
            this.orderItems = new Array<OrderItem>();
            this.lowStocks = response.stocks;
            this.lowStocks.forEach(e => {
              let o = new OrderItem('', null, e.item, e.cantMin-e.cant, '', '', null);
              this.orderItems.push(o);
            });
          }
        },
        error =>{
          console.error(error);
        }
    );
  }

  filterSector(val){
    this.tmpSectors = this.sectors.filter(sector =>{
      return (sector.name).toLowerCase().includes(val.toString().toLowerCase());
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

  onActivate(event) {
    if(event.type == 'click') {
        this.newItem(false, event.row);
    }
  }

  newItem(isNew, orderItem?: OrderItem){
    let title = isNew ? 'Nuevo articulo' : 'Editar articulo';
    let dialogRef: MatDialogRef<any> = this.dialog.open(OrderItemPopUpComponent, {
      width: '720px',
      disableClose: false,
      data: { payload: orderItem, title:title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          return;
        }

        if(res.delete){
          this.orderItems.splice(this.orderItems.indexOf(orderItem), 1);
          this.orderItems = [...this.orderItems]
        }else{
          let resOrderItem = new OrderItem('', null, res.item['item'], res.item['cant'], res.item['obs'], res.item['code'], res.item['costSector']);
          this.loader.open();
          if (isNew) {
            this.orderItems = this.orderItems.concat([resOrderItem]);
          } else {
            orderItem.cant = resOrderItem.cant;
            orderItem.item = resOrderItem.item;
            orderItem.obs = resOrderItem.obs;
            orderItem.costSector = resOrderItem.costSector;
          }
        }
        this.loader.close();
      })
  }

  send(authorize: boolean){
    if(authorize){
      //Crear y autorizar
      this.order.status = "Autorizado";
    }else{
      //Solo crear
      this.order.status = "Pendiente";
    }

    this._orderService.add(this.token, this.order).subscribe(
        response =>{
          if(response.order){
             let o = response.order;
             let update = {onOrder: true};
             this.orderItems.forEach(orderItem => {
              orderItem.order = o._id;

              this._stockService.editMany(this.token, orderItem.item['_id'], update).subscribe(
                response =>{},
                error =>{console.error(error)}
              );

              this._orderItemService.add(this.token, orderItem).subscribe(
                response =>{},
                error =>{console.error(error)}
              );

             });

             this.openSnackBar('Pedido enviado para autorizar', 'Cerrar');
             this._router.navigate(['deposit/home']);

          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );

  }
}
