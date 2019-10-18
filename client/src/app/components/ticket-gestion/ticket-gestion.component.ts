import { Component, OnInit } from '@angular/core';
import { userService } from 'app/services/user.service';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { ticketService } from 'app/services/ticket.service';
import { Ticket } from 'app/models/ticket';
import { Agent } from 'http';
import { teamService } from 'app/services/team.service';
import { Team } from 'app/models/team';

@Component({
  selector: 'app-ticket-gestion',
  templateUrl: './ticket-gestion.component.html',
  styleUrls: ['./ticket-gestion.component.scss'],
  providers: [userService, ticketService, teamService]
})
export class TicketGestionComponent implements OnInit {
  
  public ticket: Ticket;
  public reqTickets: [Ticket]
  public identity;
  public token;
  public url: string;
  public agents: [Agent];
  public teams: [Team];
  public editSub: boolean;
  public subMod:string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _ticketService: ticketService,
    private _teamService: teamService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

    this.editSub = false;
    this.subMod = '';

    this.ticket = new Ticket('','',null,'','','','','','',null,'',[''],'');
   }

  ngOnInit() {
    this.getTicket();
    this.getTeams();
  }

  getTeams(){
    this._teamService.getList(this.token).subscribe(
      response =>{
          if(!response.teams){
            this._router.navigate(['/']);
          }else{
            this.teams = response.teams;
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

  getReqTickets(req){
    if(req){
      this._ticketService.getForUser(this.token, req['_id']).subscribe(
        response =>{
            if(!response.tickets){
              this._router.navigate(['/']);
            }else{
              this.reqTickets = response.tickets;
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

  getTicket(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];

    this._ticketService.getOne(this.token, id).subscribe(
      response =>{
          if(!response.ticket){
            this._router.navigate(['/']);
          }else{
            this.ticket = response.ticket;
            this.agents = response.ticket.team.users;
            this.getReqTickets(response.ticket.requester);
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

  selectAgent(val: string){
    console.log(val);
  }

  selectTeam(val: string){
    console.log(val);
  }

  selectResolveDate(){
    console.log(this.ticket.resolveDate)
  }

  calculateClasses(status: string){
    var tmp = null;
    switch(status){
      case 'Pendiente':
        tmp = {pending:true};
        break;
      case 'Abierto':
        tmp = {open:true};
        break;
      case 'Cerrado':
        tmp = {closer:true};
        break;
      case 'Finalizado':
        tmp = {finish:true};
        break;
      default:
        break;
    }
    return tmp;
  }

  editTicketSub(){
    this.ticket.sub = this.subMod;
    this.editTicket();
    this.editSub = false;

  }

  editTicket(){
    console.log('Llegue')
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];

    this._ticketService.edit(this.token, id, this.ticket).subscribe(
      response =>{
          if(!response.ticketUpdated){
          }else{
            this.ticket = response.ticketUpdated;
            this.agents = response.ticketUpdated.team.users;
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
