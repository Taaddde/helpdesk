import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'
import { GLOBAL } from '../../services/global';
import { userService } from '../../services/user.service';
import { ticketService } from '../../services/ticket.service';

import * as moment from "moment"


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
    public status: string;

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
    this.status = 'AL_DIA'

  }

  ngOnInit() {
    this.getCountTickets();
    if(this.identity['role'] != 'ROLE_REQUESTER'){
      this.getStatusCalendar();
    }
  }

  getCountTickets(){
    if(this.identity['role'] != 'ROLE_REQUESTER'){
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
  
    }else{
      this._ticketService.getReqCountsTickets(this.token, this.identity['_id']).subscribe(
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

  getStatusCalendar(){
    this._ticketService.getCalendar(this.token, this.identity['_id']).subscribe(
      response =>{
          if(response.tickets){
            response.tickets.forEach(e => {
              var date = moment(e.resolveDate, "DD-MM-YYYY").format("YYYY-MM-DD");
              if(e.resolveDate != 'null'){
                if(moment(date).isSame(moment().format("YYYY-MM-DD"))){
                  this.status = "PENDIENTE";
                }else{
                  if(moment(date).isBefore(moment().format("YYYY-MM-DD"))){
                    this.status = "ATRASADO";
                  }
                }
              }
            });
          }
      },
      error =>{
          console.log(error);
      }
    );
  }

  getBorderClass(){
    var tmp;
    switch(this.status){
      case 'AL_DIA':
        tmp = {card:true, shadow:true, 'border-left-success':true, 'py-2':true};
        break;
      case 'PENDIENTE':
        tmp = {card:true, shadow:true, 'border-left-warning':true, 'py-2':true};
        break;
      case 'ATRASADO':
        tmp = {card:true, shadow:true, 'border-left-danger':true, 'py-2':true};
        break;
      default:
        alert('Hubo un problema con la conversación del ticket, por favor reportarlo al administrador');
        break;
    }

    return tmp;
  }

}
