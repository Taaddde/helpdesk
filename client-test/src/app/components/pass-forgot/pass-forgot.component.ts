import { Component, OnInit } from '@angular/core';

import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global';
import { userService } from '../../services/user.service';
import 'rxjs/add/observable/interval';

declare var $: any;

@Component({
  selector: 'app-pass-forgot',
  templateUrl: './pass-forgot.component.html',
  providers:[userService]
})
export class PassForgotComponent implements OnInit {

  public forgotUserName: string
  public alertMessage;
  public url: string;


  constructor(
    private _userService: userService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.alertMessage = '';
    this.url = GLOBAL.url;  
    this.forgotUserName = '';  
   }

   ngOnInit(){
     console.log('Activo')
   }


   onSubmit(){
    this._userService.forgotPassword(this.forgotUserName).subscribe(
      response =>{
          if(!response.mail){
            this.alertMessage = "Nombre de usuario inexistente"
          }else{
            alert('Se envió el correo de restablecimiento');
            this.forgotUserName = '';
            this.alertMessage = '';
            $("#passforgot").modal("hide");
          }
      },
      error =>{
          var errorMessage = <any>error;
          if(errorMessage != null){
            var body = JSON.parse(error._body);
            this.alertMessage = body.message;
          }
      }
    );
  }
}
