import { Component, OnInit } from '@angular/core';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import * as moment from "moment"
import { orderService } from 'app/shared/services/helpdesk/deposit/order.service';
import { orderItemService } from 'app/shared/services/helpdesk/deposit/orderitem.service';
import { Order } from 'app/shared/models/helpdesk/deposit/order';
import { OrderItem } from 'app/shared/models/helpdesk/deposit/orderitem';
import { Item } from 'app/shared/models/helpdesk/deposit/item';
import { itemService } from 'app/shared/services/helpdesk/deposit/item.service';
import { Sector } from 'app/shared/models/helpdesk/sector';
import { sectorService } from 'app/shared/services/helpdesk/sector.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/shared/services/date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OrderItemPopUpComponent } from './item/pop-up.component';
import { stockService } from 'app/shared/services/helpdesk/deposit/stock.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    orderService, orderItemService, itemService, sectorService, stockService
  ]
})
export class OrderDetailComponent implements OnInit {
  public token: string;
  public identity;
  public config = GLOBAL.richTextModule;

  public order: Order;
  public orderItems: OrderItem[];

  public items: Item[];
  public tmpItems: Item[] = [];

  public sectors: Sector[];
  public tmpSectors: Sector[] = [];

  public addOrderItems: OrderItem[] = new Array<OrderItem>();
  public deleteOrderItems: OrderItem[] = new Array<OrderItem>();
  public editOrderItems: OrderItem[] = new Array<OrderItem>();


  constructor(
    private _userService: userService,
    private snackBar: MatSnackBar,
    private _router: Router,
    private loader: AppLoaderService,
    private dialog: MatDialog,
    private _route: ActivatedRoute,
    private _stockService: stockService,
    private _orderService: orderService,
    private _orderItemService: orderItemService,
    private _sectorService: sectorService
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
    this.order = new Order('',null,new Date(),new Date(),null,this.identity['company']['_id'],null,'','','No creado');
  }

  ngOnInit() {
    this.getSectors();
    this.getOrders();
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

          if(orderItem._id != '')
            this.deleteOrderItems.push(orderItem);
          else
            this.addOrderItems.splice(this.addOrderItems.indexOf(orderItem), 1);

          this.orderItems.splice(this.orderItems.indexOf(orderItem), 1);
          this.orderItems = [...this.orderItems];
        }else{
          let resOrderItem = new OrderItem('', null, res.item['item'], res.item['cant'], res.item['obs'], res.item['code'], res.item['costSector'], 0);
          this.loader.open();
          if (isNew) {
            this.addOrderItems.push(resOrderItem);
            this.orderItems = this.orderItems.concat([resOrderItem]);
          } else {
            orderItem.cant = resOrderItem.cant;
            orderItem.item = resOrderItem.item;
            orderItem.obs = resOrderItem.obs;
            orderItem.costSector = resOrderItem.costSector;

            if(orderItem._id != '')
              this.editOrderItems.push(orderItem);
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

  

    this._orderService.edit(this.token, this.order._id, this.order).subscribe(
      response =>{
        if(response.order){

          this.addOrderItems.forEach(e => {
            e.order = this.order._id;
            this._orderItemService.add(this.token, e).subscribe(
                response =>{},
                error =>{}
            );
          });

          this.editOrderItems.forEach(e => {
            this._orderItemService.edit(this.token, e._id, e).subscribe(
                response =>{},
                error =>{}
            );
          });

          this.deleteOrderItems.forEach(e => {
            this._orderItemService.delete(this.token, e._id).subscribe(
                response =>{},
                error =>{}
            );
          });
           
          if(authorize)
            this.openSnackBar('Pedido autorizado', 'Cerrar');
          else 
            this.openSnackBar('Pedido guardado', 'Cerrar');

          this._router.navigate(['deposit/home']);
        }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }
}
