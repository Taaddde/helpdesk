import { Component, OnInit, ViewChild } from '@angular/core';
import {Ticket} from '../../models/ticket';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { userService } from '../../services/user.service';
import { ticketService } from '../../services/ticket.service';
import * as moment from 'moment';
import { MessageComponent } from '../message/message.component';
import { User } from 'src/app/models/user';
declare var $: any;


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['../../styles/list.scss'],
  providers:[userService, ticketService, MessageComponent]
})
export class TicketListComponent implements OnInit {
  @ViewChild(MessageComponent, {static:false}) message: MessageComponent;
  public title: String;
  public tickets: Ticket[];
  public identity;
  public token;
  public url: string;

  public groupTicket: number[];

  public limit: number;
  public page: number;
  public user: string;
  public status: string;
  public nextPage: boolean;
  public prevPage: boolean;
  public totalDocs: number;
  public totalPages: number;
  public pagingCounter: number;


  public filter: any;
  public allRequesters: User[];
  public allAgents: User[];
  public keyPress: boolean;
  public requesters: User[];
  public agents: User[];
  public requesterFilter: string;
  public agentFilter: string;

  public query: any;
  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _ticketService: ticketService,
    private _userService: userService
){
    this.title = 'Tickets',
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.limit= 10;
    this.page= 1;
    this.user = '';
    this.status = '';
    this.nextPage = true;
    this.prevPage= false;
    this.totalDocs= null;
    this.totalPages= 1;
    this.pagingCounter = 1;


    this.filter = {}

    this.agentFilter = '';
    this.requesterFilter = '';
    this.groupTicket = new Array<number>();
    this.message = new MessageComponent();

  }

  ngOnInit() {
    this.getTickets();

    if(this.identity['role'] != 'ROLE_REQUESTER'){
      this.getRequesters();
    }

    this.getAgents();

  }

  getTickets(){
    this._route.params.forEach((params: Params) =>{
      this._route.queryParams.forEach((query: Params) =>{
        this.query = query;
        this.page = params['page'];
        this.limit = params['perPage'];
        var q = query
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

        this._ticketService.getTmpPaginatedList(this.token, this.page, this.limit, query, c, r).subscribe(
          response =>{
              if(!response.tickets){
                //this._router.navigate(['/']);
              }else{
                this.tickets = response.tickets.docs;
                this.limit = response.tickets.limit;
                this.nextPage = response.tickets.nextPage;
                this.prevPage = response.tickets.prevPage;
                this.totalDocs = response.tickets.totalDocs;
                this.totalPages = response.tickets.totalPages;
                this.pagingCounter = response.tickets.pagingCounter;
              }
          },
          error =>{
              console.error(error);
          }
        );
      })
    })
  }

  getSectorTickets(){
    this._route.params.forEach((params: Params) =>{
      this._route.queryParams.forEach((query: Params) =>{
        this.query = query;
        this.page = params['page'];
        this.limit = params['perPage'];
        var sector = this.identity['sector']['_id']

        this._ticketService.getSectorPaginatedList(this.token, this.page, this.limit, query, sector).subscribe(
          response =>{
              if(!response.tickets){
                //this._router.navigate(['/']);
              }else{
                this.tickets = response.tickets.docs;
                console.log(this.tickets)
                this.limit = response.tickets.limit;
                this.nextPage = response.tickets.nextPage;
                this.prevPage = response.tickets.prevPage;
                this.totalDocs = response.tickets.totalDocs;
                this.totalPages = response.tickets.totalPages;
                this.pagingCounter = response.tickets.pagingCounter;
              }
          },
          error =>{
              console.error(error);
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
          console.error(error);
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
          console.error(error);
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
    this._router.navigate(['/ticket',this.page,this.limit]);
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
        this.message.error('Ticket cerrado', 'No es posible realizar alguna acción sobre un ticket cerrado')
      }  
    }else{
      this._router.navigate(['/ticket-gestion',ticket._id]);
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
    if (confirm('¿Esta seguro que quiere unificar los tickets seleccionados? Prevalecerá el ticket mas antiguo y se pondrá en copia a los solicitantes que hayan generado las otras consultas.')) {
      this._ticketService.unify(this.token, this.groupTicket).subscribe(
        response =>{
            if(!response.tickets){
              this._router.navigate(['/']);
            }else{
              this.message.info('Unificación realizada', 'La unificación fue realizada correctamente.')
              this.groupTicket = new Array<number>();
              this.getTickets();
            }
        },
        error =>{
            console.error(error);
        });
    }
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
