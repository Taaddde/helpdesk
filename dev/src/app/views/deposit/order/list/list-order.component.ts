import { Component, OnInit} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Order } from 'app/shared/models/helpdesk/deposit/order';
import { OrderItem } from 'app/shared/models/helpdesk/deposit/orderitem';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { orderService } from 'app/shared/services/helpdesk/deposit/order.service';
import { orderItemService } from 'app/shared/services/helpdesk/deposit/orderitem.service';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { userService } from 'app/shared/services/helpdesk/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-order-list',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css'],
  providers: [userService, orderService, orderItemService]
})
export class OrderListComponent implements OnInit {

  public orders: Order[];
  public token: string;
  public identity;
  public url = GLOBAL.url;
  public orderItems: OrderItem[];

  public orderPrint: Order;
  public num: string;

  constructor(
    private snack: MatSnackBar,
    private _userService: userService,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private _orderService: orderService,
    private _orderItemService: orderItemService
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
    this.orderPrint = new Order('',0,null,null,null,null,'','','','');
  }

  ngOnInit() {
    this.getOrders();
  }

  getOrders(){
    let query = {company: this.identity['company']['_id']};
    this._orderService.getList(this.token, query).subscribe(
        response =>{
          if(response.orders){
             this.orders = response.orders;
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

  print(order: Order){

    this.orderPrint = order;
    this.num = this.getNum(order);

    this.getOrderList(order);
  }

  getNum(order: Order):string{
    let year = moment(order.date).format('YYYY');
    let num = '';
    if(this.orderPrint.numOrder < 10){
      num = '000'+String(this.orderPrint.numOrder);
    }else{
      if(this.orderPrint.numOrder < 100){
        num = '00'+String(this.orderPrint.numOrder);
      }else{
        if(this.orderPrint.numOrder < 1000){
          num = '0'+String(this.orderPrint.numOrder);
        }else{
          num = String(this.orderPrint.numOrder);
        }
      }
    }
    return year + '-' + num;
  }

  changeDate(date: Date): string{
      return moment(date).format("DD/MM/YYYY");
  }

  getOrderList(order: Order){
    let query = {order: order._id};
    this._orderItemService.getList(this.token, query).subscribe(
        response =>{
          if(response.orderItems){
             this.orderItems = response.orderItems;

            setTimeout( () => { 
              let body = document.getElementById('order').innerHTML;
              this._orderService.print(this.token, body, order._id).subscribe(
                response =>{
                  this._orderService.getPrint(order._id).subscribe(
                      response =>{
                        if(response.message){
                            this.loader.open('Generando orden, esto puede tardar unos segundos');
                            setTimeout( () => { 
                              window.open(this.url+'order/print/'+order._id, '_blank');
                              this.loader.close();
                            }, 10000);
                        }else{
                          window.open(this.url+'order/print/'+order._id, '_blank');
                        }
                      },
                      error =>{
                        window.open(this.url+'order/print/'+order._id, '_blank');
                      }
                  );
                },
                error =>{
                    console.error(error);
                }
              );
            }, 1500 );
            
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }

}