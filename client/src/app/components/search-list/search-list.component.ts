import { Component, OnInit } from '@angular/core';
import {Ticket} from '../../models/ticket';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { userService } from 'app/services/user.service';
import { ticketService } from 'app/services/ticket.service';
import { companyService } from 'app/services/company.service';
import { teamService } from 'app/services/team.service';
import { User } from 'app/models/user';
import { Company } from 'app/models/company';
import { Team } from 'app/models/team';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
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
    private _userService: userService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

    this._route.params.forEach((params: Params) =>{
      this.stat = params['stat'];
      this.search = params['q'];
      console.log(this.search);
    })
  }

  ngOnInit() {
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

  }

  getTeams(){

  }

  getCompanies(){

  }

}
