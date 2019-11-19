import { Component, OnInit } from '@angular/core';
import {Ticket} from '../../models/ticket';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { userService } from '../../services/user.service';
import { ticketService } from '../../services/ticket.service';
import { companyService } from '../../services/company.service';
import { teamService } from '../../services/team.service';
import { User } from '../../models/user';
import { Company } from '../../models/company';
import { Team } from '../../models/team';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['../../styles/list.scss'],
  providers:[userService, ticketService, companyService, teamService]

})
export class SearchListComponent implements OnInit {

  public stat: string;
  public search: string;
  public tickets: Ticket[];
  public users: User[];
  public companies: Company[];
  public teams: Team[];
  public identity;
  public token;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _ticketService: ticketService,
    private _userService: userService,
    private _teamService: teamService,
    private _companyService: companyService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

    this._route.params.forEach((params: Params) =>{
      this.stat = params['stat'];
      this.search = params['q'];
      this.ngOnInit();
    })
  }

  ngOnInit() {
    this._router.resetConfig
    if(this.stat == 'ticket'){
      this.getTickets();
    }else{
      if(this.stat == 'user'){
        this.getUsers();
      }else{
        if(this.stat == 'team'){
          this.getTeams();
        }else{
          if(this.stat == 'company'){
            this.getCompanies();
          }else{
            this._router.navigate(['/home']);
          }
        }
      }
    }
  }

  getTickets(){
    this._ticketService.getForName(this.token, this.identity['company']['_id'], this.search).subscribe(
      response =>{
          if(!response.tickets){
            this._router.navigate(['/home']);
          }else{
            this.tickets = response.tickets;
          }
      },
      error =>{
          console.log(error);
      });
  }

  getUsers(){
    this._userService.getForName(this.token, this.identity['company']['_id'], this.search).subscribe(
      response =>{
          if(!response.users){
            this._router.navigate(['/home']);
          }else{
            this.users = response.users;
          }
      },
      error =>{
          console.log(error);
      });
  }

  getTeams(){
    this._teamService.getForName(this.token, this.identity['company']['_id'], this.search).subscribe(
      response =>{
          if(!response.teams){
            this._router.navigate(['/home']);
          }else{
            this.teams = response.teams;
            console.log(this.teams)
          }
      },
      error =>{
          console.log(error);
      });
  }

  getCompanies(){
    this._companyService.getForName(this.token, this.search).subscribe(
      response =>{
          if(!response.companies){
            this._router.navigate(['/home']);
          }else{
            this.companies = response.companies;
          }
      },
      error =>{
          console.log(error);
      });
  }

  cantUsers(val: [String]){
    return val.length;
  }


}
