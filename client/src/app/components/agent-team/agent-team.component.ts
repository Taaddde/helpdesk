import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'
import { userService } from 'app/services/user.service';
import { elementAt } from 'rxjs/operators';

@Component({
  selector: 'app-agent-team',
  templateUrl: './agent-team.component.html',
  styleUrls: ['./agent-team.component.scss'],
  providers:[userService]
})
export class AgentTeamComponent implements OnInit {
  public identity;
  public token;
  public state: String;
  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService
  ){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.state = 'agent';
  }

  ngOnInit() {
  }

  changeTo(val: string){
    this.state = val;
  }

}
