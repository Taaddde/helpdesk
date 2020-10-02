import { Component, OnInit } from '@angular/core';
import {Ticket} from '../../models/ticket';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { userService } from '../../services/user.service';
import { ticketService } from '../../services/ticket.service';
import * as moment from 'moment';
import { subtractDurations } from '@fullcalendar/core/datelib/duration';

@Component({
  selector: 'app-timework-subtype-list',
  templateUrl: './timework-subtype-list.component.html',
  styleUrls: ['../../styles/list.scss'],
})
export class TimeworkSubtypeListComponent implements OnInit {

  public tickets: Ticket[];
  public times: string[];
  public identity;
  public token;
  public url: string;
  public title: string;
  public subId:string;

  public subType: string;
  public time: number;

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

  ) {
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
    this.subType = '';
    this.time = 10;
    this.title = '';
   }

  ngOnInit() {
    this.getTimeWork();
    this.getTimes();

  }
  getTimeWork(){
    this._route.params.forEach((params: Params) =>{
      this.subType = params['subtype'];
      this.time = params['time'];
      this.page = params['page'];
      
        this._ticketService.getTimeWorkForSubtype(this.token, this.subType, this.time, this.page).subscribe(
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
                this.pagingCounter = response.tickets.pagingCounter;
                this.title = this.tickets[0].subTypeTicket['name'];
                this.subId = this.tickets[0].subTypeTicket['_id'];
              }
          },
          error =>{
              console.error(error);
          });
      })
  }

  getTimes(){
    this._route.params.forEach((params: Params) =>{
      this.subType = params['subtype'];
      this._ticketService.getTimeWorkPhase(this.token, this.subType).subscribe(
        response =>{
            if(!response.tickets){
              this._router.navigate(['/']);
            }else{
              this.times = response.tickets
            }
        },
        error =>{
            console.error(error);
        });
    })
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

  isLastPage(){
    if(this.totalDocs < this.pagingCounter+this.limit){
      return this.totalDocs;
    }else{
      return this.pagingCounter+this.limit-1;
    }
  }

  changeLimit(val: number){
    this._router.navigate(['/timework-subtype',this.tickets[0].subTypeTicket['_id'], val, this.page]);
  }

  changeDate(val:string){
    return moment(val, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm');
  }
}
