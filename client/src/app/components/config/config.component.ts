import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'
import { userService } from 'app/services/user.service';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  providers:[userService]
})
export class ConfigComponent implements OnInit {

  public identity;
  public token;
  public state: String;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,

  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.state = '';
   }

  ngOnInit() {
  }

  changeTo(val: string){
    this.state = val;
  }


}
