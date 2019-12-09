import { Component, OnInit } from '@angular/core';
import {Ticket} from '../../models/ticket';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { userService } from '../../services/user.service';
import { ticketService } from '../../services/ticket.service';
import * as moment from 'moment';

@Component({
  selector: 'app-timework-list',
  templateUrl: './timework-list.component.html',
  styleUrls: ['../../styles/list.scss'],
  providers:[userService, ticketService]
})
export class TimeworkListComponent implements OnInit {

  public title: String;
  public tickets: Ticket[];
  public filtro: String;
  public identity;
  public token;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _ticketService: ticketService,
    private _userService: userService

  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

   }

  ngOnInit() {
    this.getReport();
  }

  getReport(){      
    this._ticketService.getTimeWorkRep(this.token, this.identity['company']['_id']).subscribe(
      response =>{
          if(!response.tickets){
            this._router.navigate(['/']);
          }else{
            this.tickets = response.tickets;
            console.log(this.tickets);
          }
      },
      error =>{
          console.error(error);
      });
  }

  getCompare(defVal:number, val:number ){
    if(defVal == val){
      return '='
    }else{
      if(defVal < val){
        return '+'
      }else{
        return '-'
      }
    }

  }


}
