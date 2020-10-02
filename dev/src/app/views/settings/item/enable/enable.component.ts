import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Item } from 'app/shared/models/helpdesk/deposit/item';
import { itemService } from 'app/shared/services/helpdesk/deposit/item.service';
import { Deposit } from 'app/shared/models/helpdesk/deposit/deposit';
import { stockService } from 'app/shared/services/helpdesk/deposit/stock.service';
import { Stock } from 'app/shared/models/helpdesk/deposit/stock';
import { depositService } from 'app/shared/services/helpdesk/deposit/deposit.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-enable-item',
  templateUrl: './enable.component.html',
  providers: [userService, itemService, stockService, depositService, DragulaService]
})
export class EnableItemComponent implements OnInit {

  public token: string;
  public identity;

  public deposits: Deposit[];
  public depositSelected: Deposit;
  public depName: string = '';
  public items: Item[];
  public stocks: Stock[];

  public itemsIn: Item[];
  public itemsOut: Item[];

  folders = [
    {
      name: 'Backups',
      updated: new Date('2/2/17'),
      color: 'primary'
    },
    {
      name: 'Payments',
      updated: new Date('2/2/17'),
      color: 'warn'
    },
    {
      name: 'Orders',
      updated: new Date('2/20/17'),
      color: 'accent'
    },
    {
      name: 'Photos',
      updated: new Date('1/2/17'),
      color: 'warn'
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/17'),
      color: 'primary'
    },
    {
      name: 'Work',
      updated: new Date('1/24/17'),
      color: 'accent'
    }
  ];
  notes = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];

  constructor(
    private _userService: userService,
    private _depositService: depositService,
    private _itemService: itemService,
    private _stockService: stockService,
    private loader: AppLoaderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dragulaService: DragulaService,
    private cdr: ChangeDetectorRef
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();

    dragulaService.dropModel().subscribe((value) => {
      let target = value.target.id;
      let source = value.source.id;
      let item: Item = value.item;

      if(target != source){
        if(target == 'in'){
          //Habilitar
          let stock = new Stock('',item._id,this.depositSelected._id,0,0, false);
          this._stockService.add(this.token, stock).subscribe(
              response =>{
                if(response.stock){
                  return;
                }
              },
              error =>{
                this.openSnackBar(error.message, 'Cerrar');
              }
          );
        }else{
          //Deshabilitar
          let query = {deposit: this.depositSelected._id, item: item._id};
          this._stockService.deleteMany(this.token, query).subscribe(
              response =>{
                if(response.stock){
                   return;
                }
              },
              error =>{
                this.openSnackBar(error.message, 'Cerrar');
              }
          );
        }
      }
    });
  }

  ngOnDestroy() {
  }

  ngOnInit() {
    this.getData();
  }

  getData(){
    let query = {company: this.identity['company']['_id']};
    this._itemService.getList(this.token, query).subscribe(
      response =>{
          if(response.items){
            this.items = response.items;
            this.getDeposits();
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
            this.setDeposit(this.deposits[0]);
          }
      },
      error =>{
          this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  setDeposit(deposit: Deposit){
    this.depositSelected = deposit;
    this.depName = deposit.name;
    let query = {deposit: this.depositSelected._id};
    this._stockService.getList(this.token, query).subscribe(
      response =>{
          if(response.stocks){
            this.stocks = response.stocks;
            this.separateItems();
          }
      },
      error =>{
          this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  separateItems(){
    this.itemsIn = new Array<Item>();
    this.itemsOut = new Array<Item>();
    
    this.items.forEach(item => {
      if(this.itemIsInStock(item)){
        this.itemsIn.push(item);
      }else{
        this.itemsOut.push(item);
      }
    });
  }

  itemIsInStock(item: Item): boolean{
    let i = 0;
    while (i < this.stocks.length && this.stocks[i].item['_id'] != item._id) {
      i = i + 1;
    }

    if(i == this.stocks.length){
      return false;
    }else{
      return true;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }
}