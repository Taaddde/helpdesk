import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'
import { GLOBAL } from '../../services/global';
import { userService } from '../../services/user.service';
import { ticketService } from '../../services/ticket.service';

import * as moment from "moment"
import { Ticket } from 'src/app/models/ticket';
import { Observable } from 'rxjs';
import { workService } from 'src/app/services/work.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../styles/list.scss'],
  providers: [userService, ticketService, workService]
})
export class HomeComponent implements OnInit, OnDestroy {

    public identity;
    public token;
    public url: string;

    public open:number;
    public pending:number;
    public finish:number;
    public close: number;
    public status: string;

    public tasksFree: number;
    public tasks: number;

    public refresh;

    public tickets: Ticket[];
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
    private _userService: userService,
    private _ticketService: ticketService,
    private _workService: workService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.open = 0;
    this.pending = 0;
    this.finish = 0;
    this.close = 0;
    this.status = 'AL_DIA'


    this.limit= 5;
    this.page= 1;
    this.nextPage = true;
    this.prevPage= false;
    this.totalDocs= null;
    this.totalPages= 1;
    this.pagingCounter = 1;


  }

  ngOnInit() {
    this.getCountTickets();
    if(this.identity['role'] != 'ROLE_REQUESTER'){
      this.getTaskCount();
      this.getStatusCalendar();
      this.getTeamTickets();
      this.refresh = Observable.interval(60000).subscribe((val) => { 
        this.getCountTickets();
        this.getStatusCalendar();
        this.getTeamTickets();  
      });  
    }else{
      this.refresh = Observable.interval(120000).subscribe((val) => { 
        this.getCountTickets();
      });  
    }
  }

  changeDate(val:string){
    return moment(val, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm');
  }

  ngOnDestroy() {
    this.refresh.unsubscribe();
  }

  getTaskCount(){
    this._workService.getFreeCount(this.token, this.identity['_id']).subscribe(
      response =>{
          if(response.count){
            this.tasksFree = response.count;
          }
      },
      error =>{
          console.error(error);
    });

    this._workService.getCount(this.token, this.identity['_id']).subscribe(
      response =>{
          if(response.count){
            this.tasks = response.count;

          }
      },
      error =>{
          console.error(error);
    });

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
            console.error(error);
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
            console.error(error);
            }
      );
  
    }
  }

  redirecTo(val:string){
    if(val == 'P'){
      if(this.identity['role'] == 'ROLE_REQUESTER'){
        this._router.navigate(['/ticket',1,10], { queryParams: { status: 'Pendiente', requester:this.identity['_id'] } });
      }else{
        this._router.navigate(['/ticket',1,10], { queryParams: { status: 'Pendiente', agent:this.identity['_id'] } });

      }
    }else{
      if(this.identity['role'] == 'ROLE_REQUESTER'){
        this._router.navigate(['/ticket',1,10], { queryParams: { status: 'Finalizado', requester:this.identity['_id'] } });

      }else{
        this._router.navigate(['/ticket',1,10], { queryParams: { status: 'Finalizado', agent:this.identity['_id'] } });

      }
    }
  }

  getStatusCalendar(){
    this._ticketService.getCalendar(this.token, this.identity['_id']).subscribe(
      response =>{
          if(response.tickets){
            response.tickets.forEach(e => {
              var date = moment(e.resolveDate, "DD-MM-YYYY").format("YYYY-MM-DD");
              if(e.resolveDate != 'null'){
                if(moment(date).isBefore(moment().format("YYYY-MM-DD"))){
                  this.status = "ATRASADO";
                }else{
                  if(moment(date).isSame(moment().format("YYYY-MM-DD"))){
                    this.status = "PENDIENTE";
                  }
                }
              }
            });
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  getTeamTickets(){
    this._ticketService.getPaginatedTeamList(this.token, this.page, this.limit, this.identity['_id']).subscribe(
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

  isLastPage(){
    if(this.totalDocs < this.pagingCounter+this.limit){
      return this.totalDocs;
    }else{
      return this.pagingCounter+this.limit-1;
    }
  }

  paginate(page){
    this.page = page;
    this.getTeamTickets();
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
