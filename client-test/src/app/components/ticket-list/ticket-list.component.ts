import { Component, OnInit } from '@angular/core';
import {Ticket} from '../../models/ticket';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { userService } from '../../services/user.service';
import { ticketService } from '../../services/ticket.service';


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['../../styles/list.scss'],
  providers:[userService, ticketService]
})
export class TicketListComponent implements OnInit {
  public title: String;
  public tickets: Ticket[];
  public filtro: String;
  public identity;
  public token;
  public url: string;

  public limit: number;
  public page: number;
  public user: string;
  public status: string;
  public nextPage: boolean;
  public prevPage: boolean;
  public totalDocs: number;
  public totalPages: number;
  public pagingCounter: number;


  
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
  }

  ngOnInit() {

    this.getTickets();
  }

  getTickets(){

    this._route.params.forEach((params: Params) =>{
      this.page = params['page'];
      this.limit = params['perPage'];
      if(params['userId']){
        this.user = params['userId'];
      }
      if(params['status']){
        this.status = params['status']
      }
      
      if(this.identity['role'] == 'ROLE_REQUESTER'){
        this._ticketService.getPaginatedReqList(this.token, this.page, this.limit, this.identity['_id'], this.status).subscribe(
          response =>{
              if(!response.tickets){
                this._router.navigate(['/']);
              }else{
                this.tickets = response.tickets.docs;
                this.limit = response.tickets.limit;
                this.nextPage = response.tickets.nextPage;
                this.prevPage = response.tickets.prevPage;
                this.totalDocs = response.tickets.totalDocs;
                this.totalPages = response.tickets.totalPages;
                this.pagingCounter = response.tickets.pagingCounter
              }
          },
          error =>{
              console.error(error);
          });
      }else{
        this._ticketService.getPaginatedList(this.token, this.page, this.limit,this.identity['company']['_id'], this.status, this.user).subscribe(
          response =>{
              if(!response.tickets){
                this._router.navigate(['/']);
              }else{
                this.tickets = response.tickets.docs;
                this.limit = response.tickets.limit;
                this.nextPage = response.tickets.nextPage;
                this.prevPage = response.tickets.prevPage;
                this.totalDocs = response.tickets.totalDocs;
                this.totalPages = response.tickets.totalPages;
                this.pagingCounter = response.tickets.pagingCounter
              }
          },
          error =>{
              console.error(error);
          }
      );
      }

      
    })
  }

  changeLimit(val: number){
    this.limit = val;
    this._router.navigate(['/ticket',this.page,this.limit]);
  }
}
