import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import * as moment from 'moment';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { ticketService } from 'app/shared/services/helpdesk/ticket.service';
import { Ticket } from 'app/shared/models/helpdesk/ticket';
import { User } from 'app/shared/models/helpdesk/user';
import { GLOBAL } from 'app/shared/services/helpdesk/global';

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

  public filter: any;
  public allRequesters: User[];
  public allAgents: User[];
  public keyPress: boolean;
  public requesters: User[];
  public agents: User[];
  public requesterFilter: string;
  public agentFilter: string;

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
    private _ticketService: ticketService
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
    this.url = GLOBAL.url;

    this.filter = {}

    this.agentFilter = '';
    this.requesterFilter = '';
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

        this._ticketService.getSectorPaginatedList(this.token, this.page, this.limit, query, sector).subscribe(
          response =>{
              if(!response.tickets){
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

  getRequesters(){
    this._userService.getListReq(this.token, this.identity['company']['_id']).subscribe(
      response =>{
          if(!response.users){
            //this._router.navigate(['/']);
          }else{
            this.allRequesters = response.users;
            this.requesters = response.users;
          }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  getAgents(){
    let i;
    if(this.identity['company']){
      i = this.identity['company']['_id'];
    }else{
      i = 'null';
    }
    this._userService.getListAgents(this.token, i).subscribe(
      response =>{

          if(!response.users){
            //this._router.navigate(['/']);
          }else{
            this.allAgents = response.users
            this.agents = response.users;
          }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');

      }
    );

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
    this._router.navigate(['/ticket',this.page,this.limit], { queryParams: this.filter });
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

  focus(val){
    this.keyPress = false;
    if(val == 'r'){
      setTimeout(() => 
      {
        document.getElementById("searchrequester").focus();
      },
      1);

    }else{
      setTimeout(() => 
      {
        document.getElementById("searchagent").focus();
      },
      1);

    }
  }

  filterRequester(){
    if(this.requesterFilter.length >= 3){
      this.keyPress = true;
    }else{
      this.keyPress = false;
    }

    this.requesters = this.allRequesters.filter(requester =>{
      return (requester['name']+requester['surname']).toLowerCase().includes(this.requesterFilter.toString().toLowerCase());
    })
  }

  filterAgent(){
    if(this.agentFilter.length >= 3){
      this.keyPress = true;
    }else{
      this.keyPress = false;
    }

    this.agents = this.allAgents.filter(agent =>{
      return (agent['name']+agent['surname']).toLowerCase().includes(this.agentFilter.toString().toLowerCase());
    })
  }

  filterArguments(){
    if(this.filter['sub'] == ''){
      this.filter['sub'] = null;
    }
    if(this.identity['role'] == 'ROLE_REQUESTER'){
      this.filter['requester'] = this.identity['_id'];
    }
    this._router.navigate(['/ticket',1,10], { queryParams: this.filter });

    $("#filter").modal("hide");      

  }

  set(item, option){
    switch (option) {
      case 'requester':
        this.requesterFilter = '';
        this.filter['requester'] = item['_id'];
        $('#requestername').val(item['name']+' '+item['surname']);
  
        break;
      case 'agent':
        this.requesterFilter = '';
        this.filter['agent'] = item['_id'];
        $('#agentname').val(item['name']+' '+item['surname']);  
        break;
        
      case 'status':
        this.filter['status'] = item;
        $('#statusname').val(item);  

        break;
      
      default:
        break;
    }
  }

  deleteFilter(val){
    switch (val) {
      case 'requester':
        this.filter['requester'] = null;
        $('#requestername').val('');

        break;
      case 'agent':
        this.filter['agent'] = null;
        $('#agentname').val('');

        break;
      case 'status':
        this.filter['status'] = null;
        $('#statusname').val('');

        break;
      case 'sub':
        this.filter['sub'] = '';
          break;
      case 'numTicket':
        this.filter['numTicket'] = null;
          break;
      default:
        break;
    }

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


}