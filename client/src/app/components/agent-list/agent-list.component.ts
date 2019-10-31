import { Component, OnInit } from '@angular/core';
import { userService } from 'app/services/user.service';
import { User } from 'app/models/user';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'

@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['../../styles/list.scss'],
  providers:[userService]
})
export class AgentListComponent implements OnInit {

  public users: User[];
  public filtro: String;
  public identity;
  public token;
  public url: string;
  public nextPage;
  public prevPage;
  public confirmado: String;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService
  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.nextPage = 1;
    this.prevPage = 1;
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(){
    this._userService.getListAgents(this.token, this.identity['company']['_id']).subscribe(
      response =>{
          if(!response.users){
            this._router.navigate(['/']);
          }else{
            this.users = response.users;
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
