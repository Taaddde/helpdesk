import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Deposit } from 'app/shared/models/helpdesk/deposit/deposit';
import { Item } from 'app/shared/models/helpdesk/deposit/item';
import { Reason } from 'app/shared/models/helpdesk/deposit/reason';
import { Stock } from 'app/shared/models/helpdesk/deposit/stock';
import { Sector } from 'app/shared/models/helpdesk/sector';
import { User } from 'app/shared/models/helpdesk/user';
import { APP_DATE_FORMATS, AppDateAdapter } from 'app/shared/services/date-adapter';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { depositService } from 'app/shared/services/helpdesk/deposit/deposit.service';
import { movimService } from 'app/shared/services/helpdesk/deposit/movim.service';
import { reasonService } from 'app/shared/services/helpdesk/deposit/reason.service';
import { stockService } from 'app/shared/services/helpdesk/deposit/stock.service';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { sectorService } from 'app/shared/services/helpdesk/sector.service';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TicketSearchComponent } from './search-ticket/ticket-search.component';
import { Ticket } from 'app/shared/models/helpdesk/ticket';
import { Movim } from 'app/shared/models/helpdesk/deposit/movim';

@Component({
  selector: 'app-new-movim-form',
  templateUrl: './new-movim.component.html',
  styleUrls: ['./new-movim.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
      userService, depositService, stockService, movimService, sectorService, reasonService
    ],
})
export class NewMovimComponent implements OnInit {
    formData = {}
    form: FormGroup;

    public token: string;
    public identity;
    public url: string = GLOBAL.url;

    public numTicket = null;

    public deposits: Deposit[];

    public stocks: Stock[];
    public tmpStocks: Stock[];

    public requesters: User[];
    public tmpRequesters: User[];

    public sectors: Sector[];

    public reasons: Reason[];

  constructor(
      private _userService: userService,
      private _depositService: depositService, 
      private _stockService: stockService,
      private _movimService: movimService,
      private _reasonService: reasonService,
      private _sectorService: sectorService,
      private snackBar: MatSnackBar,
      private dialog: MatDialog,
      private router: Router,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
   }

  ngOnInit() {
    this.form = new FormGroup({
        type: new FormControl('', [
            Validators.required
        ]),
        deposit: new FormControl('', [
            Validators.required
        ]),
        item: new FormControl('', [
            Validators.required
        ]),
        cant: new FormControl(1, [
            Validators.min(1),
            Validators.required
        ]),
        reason: new FormControl('', [
            Validators.required
        ]),
        date: new FormControl(new Date(), [
            Validators.required,
        ]),


        requester: new FormControl(''),
        sector: new FormControl(''),
        ticket: new FormControl(''),


        depositDestiny: new FormControl(''),

        obs: new FormControl(''),
    })

    

    this.getDeposits();
    this.getRequesters();
    this.getSectors();
    this.setType('Ingreso');
  }


  getRequesters(){
    this._userService.getListReq(this.token, this.identity['company']['_id']).subscribe(
        response =>{
          if(response.users){
            this.requesters = response.users;
            this.tmpRequesters = response.users;
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
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

  getReasons(type: string){
      this._reasonService.getList(this.token, {type: type}).subscribe(
          response =>{
            if(response.reasons){
               this.reasons = response.reasons;
            }
          },
          error =>{
            this.openSnackBar(error.message, 'Cerrar');
          }
      );
  }

  getDeposits(){
    this._depositService.getList(this.token, {company: this.identity['company']['_id']}).subscribe(
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
    this.form.controls['deposit'].setValue(deposit._id);
    this.form.controls['item'].setValue(null);
    this.getStocks(deposit);
  }

  setStock(stock: Stock){
    this.form.controls['item'].setValue(stock.item['_id']);
  }

  setType(type: string){
      this.form.controls['type'].setValue(type);
      this.form.controls['reason'].setValue(null);
      this.getReasons(type);
  }

  setRequester(user:User){
    this.form.controls['requester'].setValue(user);
    if(user.sector){
        this.form.controls['sector'].setValue(user.sector);
    }
  }

  getStocks(deposit: Deposit){
      this._stockService.getList(this.token, {deposit: deposit._id}).subscribe(
          response =>{
            if(response.stocks){
               this.stocks = response.stocks;
               this.tmpStocks = response.stocks;
            }
          },
          error =>{
            this.openSnackBar(error.message, 'Cerrar');
          }
      );
  }

  searchTicket(){
    let dialogRef: MatDialogRef<any> = this.dialog.open(TicketSearchComponent, {
      width: '80%',
      disableClose: false,
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          return;
        }
        let ticket: Ticket = res.ticket;

        this.form.controls['ticket'].setValue(ticket);
        if(!this.form.controls['requester'].value){
          this.setRequester(this.form.controls['ticket'].value['requester'])
        }
      })
  }

  submit(){
    switch (this.form.value.type) {
      case 'Egreso':

        let stock: Stock = this.form.value.item;
        if(stock.cant < this.form.value.cant){
          return this.openSnackBar('El stock actual del articulo es de '+stock.cant, 'Cerrar');
        }else{
          this.saveStock(stock);
        }
        
        break;

      case 'Transferencia':
        let stock2: Stock = this.form.value.item;
        if(stock2.cant < this.form.value.cant){
          return this.openSnackBar('El stock actual del articulo es de '+stock2.cant, 'Cerrar');
        }

        if(this.form.value.depositDestiny == this.form.value.deposit){
          return this.openSnackBar('No puede registrarse una transferencia de un depósito hacia si mismo', 'Cerrar');
        }
  
        let query = {item: this.form.value.item['item']['_id'], deposit: this.form.value.depositDestiny};
        this._stockService.getList(this.token, query).subscribe(
            response =>{
              if(response.stocks && response.stocks[0]){
                this.saveStock(stock2, response.stocks[0]);
              }else{
                return this.openSnackBar('El articulo no esta habilitado en el depósito destino', 'Cerrar');
              }
            },
            error =>{
              this.openSnackBar(error.message, 'Cerrar');
            }
        );
        break;
    
      default:
        this.saveStock(this.form.value.item);
        break;
    }
    

  }

  saveMovim(){
    let movim = new Movim(
      '',
      null,
      this.form.value.type,
      this.form.value.deposit,
      this.form.value.item['item']['_id'],
      this.identity['company']['_id'],
      this.form.value.cant,
      this.identity['_id'],
      this.form.value.reason,
      this.form.value.date,
      null,
      this.form.value.sector,
      this.form.value.requester['_id'],
      this.form.value.ticket['_id'],
      this.form.value.depositDestiny,
      this.form.value.obs
    );


    

    if(this.form.value.requester == '')
       movim.requester = null;

    if(this.form.value.sector == '')
      movim.sector = null;

    if(this.form.value.ticket == '')
      movim.ticket = null;

    if(this.form.value.depositDestiny == '')
      movim.depositDestiny = null;


    this._movimService.add(this.token, movim).subscribe(
        response =>{
          if(response.movim){
            this.openSnackBar('Movimiento realizado correctamente', 'Cerrar');
            this.router.navigate(['deposit/movim/list']);
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }

  saveStock(stock: Stock, stockDestiny?: Stock){
    let update = null;
    let updateDestiny = null;
    switch (this.form.value.type) {
      case 'Ingreso':
        update = {$inc: {cant: this.form.value.cant}};
        break;

      case 'Egreso':
        update = {$inc: {cant: -this.form.value.cant}};
        break;

      case 'Transferencia':
        update = {$inc: {cant: -this.form.value.cant}};
        updateDestiny = {$inc: {cant: this.form.value.cant}};
        break;

      case 'Ajuste':
        update = {cant: this.form.value.cant};
        break;
      default:
        break;
    }

    this._stockService.edit(this.token, stock._id, update).subscribe(
        response =>{
          if(response.stock){
            if(updateDestiny != null){
              this._stockService.edit(this.token, stockDestiny._id, updateDestiny).subscribe(response =>{}, error =>{});
            }

            this.saveMovim();
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

  filterStock(val){
    this.tmpStocks = this.stocks.filter(stock =>{
      return (stock.item['name']+stock.item['brand']).toLowerCase().includes(val.toString().toLowerCase());
    })
  }

  filterRequester(val){
    this.tmpRequesters = this.requesters.filter(req =>{
      return (req.name+req.surname).toLowerCase().includes(val.toString().toLowerCase());
    })
  }

  displayItem(stock: Stock): string {
      if(stock){
        return stock.item['name']+' | '+stock.item['brand'];

      }else{
          return '';
      }
  }

  displayUser(user: User): string {
      if(user){
        return user.name+' '+user.surname;
      }else{
          return '';
      }
  }
}