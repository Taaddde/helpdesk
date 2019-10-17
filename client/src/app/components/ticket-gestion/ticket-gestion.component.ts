import { Component, OnInit } from '@angular/core';
import { userService } from 'app/services/user.service';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { ticketService } from 'app/services/ticket.service';
import { Ticket } from 'app/models/ticket';

@Component({
  selector: 'app-ticket-gestion',
  templateUrl: './ticket-gestion.component.html',
  styleUrls: ['./ticket-gestion.component.scss'],
  providers: [userService, ticketService]
})
export class TicketGestionComponent implements OnInit {
  
  public ticket: Ticket;
  public identity;
  public token;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _ticketService: ticketService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

    this.ticket = new Ticket('',null,'','','','','','',null,'',[''],'');
   }

  ngOnInit() {
    this.getTicket();
  }

  getTicket(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];

    this._ticketService.getOne(this.token, id).subscribe(
      response =>{
          if(!response.ticket){
            this._router.navigate(['/']);
          }else{
            this.ticket = response.ticket;
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
    });
  }

}
