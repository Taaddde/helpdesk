import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'
import { GLOBAL } from 'app/services/global';
import { userService } from 'app/services/user.service';
import { ticketService } from 'app/services/ticket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [userService, ticketService]
})
export class HomeComponent implements OnInit {

  public identity;
  public token;
  public url: string;

    public open:number;
    public pending:number;
    public finish:number;
    public close: number;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _ticketService: ticketService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.open = 0;
    this.pending = 0;
    this.finish = 0;
    this.close = 0;
  }

  ngOnInit() {
    if(this.identity['role'] != 'ROLE_REQUESTER'){
      this.getCountTickets();
    }
  }

  getCountTickets(){
    this._ticketService.getCountsTickets(this.token,this.identity['company']['_id'], this.identity['_id']).subscribe(
      response =>{
          if(!response.tickets){
            this._router.navigate(['/']);
          }else{
            response.tickets.forEach(type => {
              switch(type._id){
                case 'Abierto':
                  this.open = type.count;
                  break;
                case 'Pendiente':
                  this.pending = type.count;
                  break;
                case 'Finalizado':
                  this.finish = type.count;
                  break;
                case 'Cerrado':
                  this.close = type.count;
                  break;
              }
            });
          }
      },
      error =>{
          console.log(error);
          }
    );
  }

}
