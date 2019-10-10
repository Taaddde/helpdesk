import { Component, OnInit } from '@angular/core';
import {User} from './models/user';

import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from './services/global';
import { userService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[userService]
})
export class AppComponent implements OnInit {
  public title = 'HelpDesk';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public alertMessage;
  public url: string;

  

  //Asigna un valor a una propiedad
  constructor(
    private _userService: userService,
    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.user = new User('','','','','','',[''],'ROLE_REQUESTER','','');
    this.user_register = new User('','','','','','',[''],'ROLE_REQUESTER','','');
    this.url=GLOBAL.url;
    this.alertMessage = '';
  } 

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit(){
    //conseguir los datos del usuario identificado
    this._userService.login(this.user).subscribe(
      response =>{
        let identity = response.user;
        this.identity = identity;

        if(!identity._id){
          this.alertMessage = "El usuario no esta correctamente identificado";

        }else{
          // Crear elemento en el localstorage para tener el usuario en sesion
          //Como si fuera una session
          localStorage.setItem('identity', JSON.stringify(identity));


          // Conseguir el token para enviarselo a cada peticion http
          this._userService.login(this.user, 'true').subscribe(
            response =>{
              let token = response.token;
              this.token = token;

              if(this.token.lenght <= 0){
                alert("El token no se ha generado correctamente");

              }else{
                // Crear elemento en el localstorage para tener el token en sesion
                localStorage.setItem('token', token);
                this.user = new User('','','','','','',[''],'ROLE_REQUESTER','','');
                location.reload();
              }
            },
            error =>{
              var errorMessage = <any>error;
              if(errorMessage != null){
                var body = JSON.parse(error._body);
                this.alertMessage = body.message;
                console.log(error);
              }
            }
          )
        }   
      },
      error =>{
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.alertMessage = body.message;
          console.log(error);
        }
      }
    )
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    
    localStorage.clear();
    //para actualizar la pagina
    location.reload();

    this._router.navigate(['/']);
  }
/*
  public alertRegister;

  onSubmitRegister(){
    console.log(this.user_register);

    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;

        if(!user._id){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El registro se ha realizado correctamente';
          this.user_register = new User('','','','','','ROLE_USER','');
        }

      },
      error =>{
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;

          console.log(error);
        }
      }
    );
  }*/
}
