import { Component, OnInit } from '@angular/core';
import {Ticket} from '../../models/ticket';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { userService } from 'app/services/user.service';
import { ticketService } from 'app/services/ticket.service';


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

      this._ticketService.getPaginatedList(this.token, this.page, this.limit).subscribe(
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
              var errorMessage = <any>error;
              if(errorMessage != null){
              var body = JSON.parse(error._body);
              //this.alertMessage = body.message;
              console.log(error);
              }
          }
      );
    })
  }

  changeLimit(val: number){
    this.limit = val;
    this._router.navigate(['/ticket',this.page,this.limit]);
  }
}
