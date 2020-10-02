import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'
import { userService } from '../../services/user.service';

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
    this._route.params.forEach((params: Params) =>{
      let back = params['back'];
      if(back == 'requester'){
        this.state = 'requester';
      }else{
        if(back == 'team'){
          this.state = 'team';
        }
      }
    })
  }

  changeTo(val: string){
    this.state = val;
  }

}
