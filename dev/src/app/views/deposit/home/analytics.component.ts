import {
  Component,
  OnInit
} from "@angular/core";
import { egretAnimations } from "app/shared/animations/egret-animations";
import { ThemeService } from "app/shared/services/theme.service";
import tinyColor from 'tinycolor2';
import { ActivatedRoute } from "@angular/router";
import { userService } from "app/shared/services/helpdesk/user.service";
import { stockService } from "app/shared/services/helpdesk/deposit/stock.service";
import { Stock } from "app/shared/models/helpdesk/deposit/stock";
import { Movim } from "app/shared/models/helpdesk/deposit/movim";
import { movimService } from "app/shared/services/helpdesk/deposit/movim.service";
import * as moment from 'moment';
import { Deposit } from "app/shared/models/helpdesk/deposit/deposit";
import { depositService } from "app/shared/services/helpdesk/deposit/deposit.service";
import { orderService } from "app/shared/services/helpdesk/deposit/order.service";
import { orderItemService } from "app/shared/services/helpdesk/deposit/orderitem.service";
import { Order } from "app/shared/models/helpdesk/deposit/order";
import { OrderItem } from "app/shared/models/helpdesk/deposit/orderitem";
import { Item } from "app/shared/models/helpdesk/deposit/item";

@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html",
  providers: [userService, stockService, movimService, depositService, orderService, orderItemService],
  styleUrls: ["./analytics.component.scss"],
  animations: egretAnimations
})
export class DepositAnalyticsComponent implements OnInit {

  public token: string;
  public identity;

  public stockMissing: Stock[];
  public stocks: Stock[];
  public temp = [];
  public lastestMovims: Movim[];

  public stockMissingColumns = [
    {
      prop: 'completeName',
      name: 'Articulo',
      flexGrow: 2
    },
    {
      prop: 'cant',
      name: 'Cantidad',
      flexGrow: 1
    },
    {
      prop: 'cantMin',
      name: 'Mínimo',
      flexGrow: 1
    },
    {
      prop: 'depositName',
      name: 'Depósito',
      flexGrow: 1
    }
  ];
  public itemsPending : string[];

  public deposits: Deposit[];
  public deposit: Deposit;

  constructor(
    private themeService: ThemeService,
    private _route: ActivatedRoute,
    private _userService: userService,
    private _stockService: stockService,
    private _movimService: movimService,
    private _depositService: depositService,
    private _orderService: orderService,
    private _orderItemService: orderItemService,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
  }

  ngAfterViewInit() {}
  ngOnInit() {
    this.getLastestMovims(5);
    this.getDeposits();
  }

  getOrders(){
    let query = {company: this.identity['company']['_id'], status: "Pendiente"};
    this._orderService.getList(this.token, query).subscribe(
        response =>{
          if(response.orders){
            let orders: Order[] = response.orders;
            let orderIds = new Array<string>();
            orders.forEach(e => {
              orderIds.push(e._id);
            });

            this.getOrderItems(orderIds);
          }
        },
        error =>{console.error(error.message)}
    );
  }

  getOrderItems(orders: Array<string>){
    this.itemsPending = new Array<string>();
    let query = {order: orders};
    this._orderItemService.getList(this.token, query).subscribe(
        response =>{
          if(response.orderItems){
            let oi: OrderItem[] = response.orderItems;
            oi.forEach(e => {
              this.itemsPending.push(e.item['_id']);
            });
            this.stockMissing.forEach(stock => {
              if(this.itemsPending.indexOf(stock.item['_id']) != -1){
                this.stockMissing.splice(this.stockMissing.indexOf(stock), 1);
                this.stockMissing = [...this.stockMissing]
              }
            });

          }
        },
        error =>{console.error(error.message)}
    );
  }

  getDeposits(){
    let query = {company: this.identity['company']['_id']};
    this._depositService.getList(this.token, query).subscribe(
        response =>{
          if(response.deposits){
            this.deposits = response.deposits;
            this.deposit = this.deposits[0];
            this.getStock(this.deposit);
            let depositsIds = new Array<string>();
            this.deposits.forEach(e => {
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

  getStock(deposit: Deposit){
    let query = {deposit: deposit._id};
    this._stockService.getList(this.token, query).subscribe(
        response =>{
          if(response.stocks){
             this.stocks = response.stocks;
             this.temp = response.stocks;

             for (let i = 0; i < this.stocks.length; i++) {
               const e = this.stocks[i];
               
               this.stocks[i]['itemName'] = e.item['name'];
               this.stocks[i]['brandName'] = e.item['brand'];

               this.temp[i]['itemName'] = e.item['name'];
               this.temp[i]['brandName'] = e.item['brand'];
             }
          }
        },
        error =>{
          console.error(error);
        }
    );
  }

  getStockMissing(depositIds: Array<String>){
    let query = { deposit: depositIds, onOrder: false, $where: "this.cant < this.cantMin"};
    this._stockService.getList(this.token, query).subscribe(
        response =>{
          if(response.stocks){
             this.stockMissing = response.stocks;
             this.stockMissing.forEach(e => {
               e['completeName'] = e.item['name'] + ' ' + e.item['brand'];
               e['depositName'] = e.deposit['name'];
             });

             //this.getOrders();

          }
        },
        error =>{
          console.error(error);
        }
    );
  }

  getLastestMovims(limit){
    let query = {};

    this._movimService.getLastestList(this.token, query, limit).subscribe(
        response =>{
          if(response.movims){
             this.lastestMovims = response.movims;
          }
        },
        error =>{
          console.error(error);
        }
    );
  }

  changeDate(val:string){
    return moment(val).format('DD-MM-YYYY');
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    var columns = Object.keys(this.temp[0]);
    // Removes last "$$index" from "column"
    columns.splice(columns.length - 1);

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

    this.stocks = rows;

  }

  check(itemId): boolean{
    if(this.itemsPending.indexOf(itemId) != -1){
      return true;
    }else{
      return false;
    }
  }


}
