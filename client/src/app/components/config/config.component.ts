import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'
import { userService } from 'app/services/user.service';
import { responseService } from 'app/services/response.service';
import { Response } from 'app/models/response';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  providers:[userService, responseService]
})
export class ConfigComponent implements OnInit {

  public identity;
  public token;
  public state: String;

  public responses: Response[];
  public response: Response;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _responseService: responseService

  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.state = 'response';
    this.response = new Response('','','',this.identity['_id']);
   }

  ngOnInit() {
    this.getResponses();
  }

  getResponses(){
    this._responseService.getList(this.token,this.identity['_id']).subscribe(
      response =>{
          if(!response.responses){
              alert('Error en el servidor');
          }else{
            this.responses = response.responses;
              console.log(this.responses)
          }
      },
      error =>{
          console.log(error);
      }
    );
  }

  onSubmit(){
    this.response.hashtag = '#'+this.response.hashtag.replace(' ', '');

    this._responseService.add(this.token,this.response).subscribe(
      response =>{
          if(!response.response){
              alert('Error en el servidor');
          }else{
            this.response = new Response('','','',this.identity['_id']);
            this.getResponses();
          }
      },
      error =>{
          console.log(error);
      }
    );
  }

}
