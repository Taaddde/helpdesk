import { Component, OnInit, AfterViewInit } from '@angular/core';
import {User} from '../../models/user';

import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global';
import { userService } from '../../services/user.service';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'app-pass-reset',
  templateUrl: './pass-reset.component.html',
  styleUrls: ['./pass-reset.component.scss'],
  providers:[userService]
})
export class PassResetComponent implements OnInit {

  public validUrl:boolean;
  public user: User;
  public confirmPass: string;

  public title = 'Recuperación de contraseña';
  public alertMessage;
  public url: string;


  constructor(
    private _userService: userService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.validUrl = false;
    this.alertMessage = '';
    this.confirmPass = '';
    this.url = GLOBAL.url;
    this.user = new User('','','','','','','','','','', false,'');
    
   }

  ngOnInit() {
    this.validateUrl();
    if(localStorage.getItem('identity') || localStorage.getItem('token')){
      localStorage.clear();
      location.reload()
    }
  }

  validateUrl(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];
      let passToken = params['passToken'];
      this._userService.validUser(id, passToken).subscribe(
        response =>{
            if(!response.user){
              this.validUrl = false;
            }else{
              this.user = response.user;
              this.title = '¡Hola '+this.user.name+'! recuperemos tu contraseña';
              this.validUrl = true;
            }
        },
        error =>{
          this.validUrl = false;
            var errorMessage = <any>error;
            if(errorMessage != null){
              var body = JSON.parse(error._body);
              this.alertMessage = body.message;
            }
        }
      );
    })
  }

  onSubmit(){
    if(this.user.password != this.confirmPass){
      this.alertMessage = 'La contraseña ingresada no coincide con la contraseña de confirmación'
    }else{
      this._userService.resetPass(this.user._id, this.user.passToken, this.confirmPass).subscribe(
        response =>{
            if(!response.user){
              this.alertMessage = 'Hubo un problema en el servidor, contacte con el administrador'
            }else{
              alert('Contraseña modificada');
              window.location.href = '/home';
            }
        },
        error =>{
          this.validUrl = false;
            var errorMessage = <any>error;
            if(errorMessage != null){
              var body = JSON.parse(error._body);
              this.alertMessage = body.message;
            }
        }
      );
    }
  }
}
