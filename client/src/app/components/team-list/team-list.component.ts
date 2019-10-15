import { Component, OnInit } from '@angular/core';
import { Team } from 'app/models/team';
import { userService } from 'app/services/user.service';
import { teamService } from 'app/services/team.service';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['../../styles/list.scss'],
  providers:[userService, teamService]
})
export class TeamListComponent implements OnInit {

  public teams: Team[];
  public identity;
  public token;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _teamService: teamService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
   }

  ngOnInit() {
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

  cantUsers(val: [String]){
    return val.length;
  }

}
