import { Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import * as moment from 'moment';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { ticketService } from 'app/shared/services/helpdesk/ticket.service';
import { Ticket } from 'app/shared/models/helpdesk/ticket';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { FilterComponent } from './filtro/filter.component';

declare var $: any;

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css'],
  providers: [userService, ticketService]
})
export class TicketListComponent implements OnInit {

  public token: string;
  public identity: string; 
  public url: string;

  public limit: number;
  public page: number;
  public nextPage: boolean;
  public prevPage: boolean;
  public totalDocs: number;
  public totalPages: number;
  public pagingCounter: number;

  public query: any;

  public groupTicket: number[];

  public tickets: Ticket[];


  constructor(
    private dialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private snackBar: MatSnackBar,
    private _userService: userService,
    private _ticketService: ticketService,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
    this.url = GLOBAL.url;

    this.groupTicket = new Array<number>();

  }

  ngOnInit() {
    this.setQuery();
    this.getTickets();


  }

  setQuery(){
    this.query = {}
  }

  getTickets(){
    this.loader.open('Cargando tickets');
    this._route.params.forEach((params: Params) =>{
      this._route.queryParams.forEach((query: Params) =>{
        this.query = query;
        this.page = params['page'];
        this.limit = params['limit'];
        var c;
        var r;
        if(this.identity['company'] && this.identity['company'] != null){
          c = this.identity['company']['_id'];
        }else{
          c = null;
        }

        if(this.identity['role'] == 'ROLE_REQUESTER'){
          r = this.identity['_id']
        }

        this._ticketService.getList(this.token, this.page, this.limit, query, c, r).subscribe(
          response =>{
              if(response.tickets){
                this.tickets = response.tickets.docs;
                this.limit = response.tickets.limit;
                this.nextPage = response.tickets.nextPage;
                this.prevPage = response.tickets.prevPage;
                this.totalDocs = response.tickets.totalDocs;
                this.totalPages = response.tickets.totalPages;
                this.pagingCounter = response.tickets.pagingCounter;

                this.loader.close();
              }
          },
          error =>{
              this.openSnackBar(error.message, 'Cerrar');
          }
        );
      })
    })
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  
  getSectorTickets(){
    this.loader.open('Cargando tickets');
    this._route.params.forEach((params: Params) =>{
      this._route.queryParams.forEach((query: Params) =>{
        this.query = query;
        this.page = params['page'];
        this.limit = params['perPage'];
        var sector = this.identity['sector']['_id']
        console.log(this.identity)
        this._ticketService.getSectorPaginatedList(this.token, this.page, this.limit, query, sector).subscribe(
          response =>{
              if(response.tickets){
                this.tickets = response.tickets.docs;
                this.limit = response.tickets.limit;
                this.nextPage = response.tickets.nextPage;
                this.prevPage = response.tickets.prevPage;
                this.totalDocs = response.tickets.totalDocs;
                this.totalPages = response.tickets.totalPages;
                this.pagingCounter = response.tickets.pagingCounter;
                this.loader.close();
              }
          },
          error =>{
            this.openSnackBar(error.message, 'Cerrar');
          }
        );
      })
    })
  }

  isLastPage(){
    if(this.totalDocs < this.pagingCounter+this.limit){
      return this.totalDocs;
    }else{
      return this.pagingCounter+this.limit-1;
    }
  }

  changeLimit(val: number){
    this.limit = val;
    this._router.navigate(['/ticket/list',this.page,this.limit], { queryParams: this.query });
  }

  changeDate(val:string){
    return moment(val, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm');
  }

  selectTicket(event, ticket: Ticket){
    if(event.ctrlKey){
      if(ticket.status != 'Cerrado'){
        if(this.groupTicket.indexOf(ticket.numTicket) != -1){
          this.groupTicket.splice(this.groupTicket.indexOf(ticket.numTicket),1);
        }else{
          this.groupTicket.push(ticket.numTicket)
        }
      }else{
        this.openSnackBar('El ticket se encuentra cerrado', 'Cerrar');
      }  
    }else{
      this._router.navigate(['/ticket/gestion',ticket._id]);
    }
  }

  isInGroup(ticket:Ticket){
    if(this.groupTicket.indexOf(ticket.numTicket) == -1){
      return false;
    }else{
      return true;
    }
  }

  unify(){
    this.confirmService.confirm({message: '¿Esta seguro que quiere unificar los tickets seleccionados? Prevalecerá el ticket mas antiguo y se pondrá en copia a los solicitantes que hayan generado las otras consultas.'})
      .subscribe(res => {
        if (res) {
          this._ticketService.unify(this.token, this.groupTicket).subscribe(
            response =>{
                if(!response.tickets){
                  this._router.navigate(['/']);
                }else{
                  this.openSnackBar('Unificación realizada', 'Cerrar');
                  this.groupTicket = new Array<number>();
                  this.getTickets();
                }
            },
            error =>{
              this.openSnackBar(error.message, 'Cerrar');
            });
        }
      })
  }

  getQuery(){
    this._route.queryParams.forEach((query: Params) =>{
      return query;
    })
  }

  refCheck(event:any){
    if(event.currentTarget.checked){
      this.getSectorTickets();
    }else{
      this.getTickets();
    }
  }

  openPopUp() {
    let title = 'Filtro de tickets';
    this.loader.open();
    let dialogRef: MatDialogRef<any> = this.dialog.open(FilterComponent, {
      width: '720px',
      disableClose: false,
      data: { title:title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(res) {
          
          this._router.navigate(['ticket/list',1,this.limit], { queryParams: res });
        }
        this.loader.close();

      })
  }



}