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
  public nextPage;
  public prevPage;
  public confirmado: String;
  
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
    this.nextPage = 1;
    this.prevPage = 1;
}

  ngOnInit() {

    this.getTickets();
  }

  getTickets(){

  
    this._ticketService.getList(this.token).subscribe(
        response =>{
            if(!response.tickets){
              this._router.navigate(['/']);
            }else{
              this.tickets = response.tickets;
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
  }
}
