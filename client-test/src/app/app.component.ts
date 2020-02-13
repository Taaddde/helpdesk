import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {User} from './models/user';

import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from './services/global';
import { userService } from './services/user.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { ticketService } from './services/ticket.service';
import { globalService } from './services/global.service';
import { MessageComponent } from './components/message/message.component';
declare var $: any;




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[userService, ticketService, globalService]
})
export class AppComponent implements OnInit {
  @ViewChild(MessageComponent, {static:false}) message: MessageComponent;

  public title = 'Mesa de ayuda';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public alertMessage;
  public url: string;
  public sub;
  public notifications;
  public searched;
  public valSearch:string;
  public reset:boolean;

  public count = 0;
  
  //Asigna un valor a una propiedad
  constructor(
    private _userService: userService,
    private _ticketService: ticketService,
    private _globalService: globalService,

    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.user = new User('','','','','','','',false,'ROLE_REQUESTER','','','', false,'');
    this.user_register = new User('','','','','','','',false,'ROLE_REQUESTER','','','', false,'');
    this.url=GLOBAL.url;
    this.alertMessage = '';
    this.notifications = '';
    this.valSearch = '';
    this.reset = false;
    this.message = new MessageComponent();

  } 

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    if(this.identity){
      this.getMessages();
      if(this.identity['role'] != 'ROLE_REQUESTER'){
        this.checkClose();
        this.sub = Observable.interval(15000).subscribe((val) => { 
          this.getMessages();
        });
      }else{
        this.getMessagesReq();
        this.sub = Observable.interval(15000).subscribe((val) => { 
          this.getMessagesReq();
        });
      }
    }
    if(window.location.pathname.split('/')[1] == 'reset-password'){
      this.reset = true;
    }
  }

  checkClose(){
    this._ticketService.checkClose(this.token).subscribe(
      response =>{
          
      },
      error =>{
          var errorMessage = <any>error;
          if(errorMessage != null){
          var body = JSON.parse(error._body);
          //this.alertMessage = body.message;
          console.error(error);
          }
      }
    );
  }

  getMessages(){
    this._ticketService.getMessages(this.token, this.identity['_id']).subscribe(
      response =>{
          if(!response.textblocks){
          }else{
            this.notifications = response.textblocks;
          }
      },
      error =>{
          var errorMessage = <any>error;
          if(errorMessage != null){
          var body = JSON.parse(error._body);
          //this.alertMessage = body.message;
          console.error(error);
          }
      }
    );
  }

  getMessagesReq(){
    this._ticketService.getMessagesReq(this.token, this.identity['_id']).subscribe(
      response =>{
          if(!response.textblocks){
          }else{
            this.notifications = response.textblocks;
          }
      },
      error =>{
          var errorMessage = <any>error;
          if(errorMessage != null){
          var body = JSON.parse(error._body);
          //this.alertMessage = body.message;
          console.error(error);
          }
      }
    );
  }


  getLenght(a: Array<any>){
    return a.length;
  }

  public onSubmit(){
    //conseguir los datos del usuario identificado
    this._userService.login(this.user).subscribe(
      response =>{
        let identity = response.user;

        if(!identity._id){
          this.alertMessage = "El usuario no esta correctamente identificado";
        }else{
          this.identity = identity;
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
                this.user = new User('','','','','','','',false,'ROLE_REQUESTER','','','', false,'');
                //this._router.navigate(['/home']);
                console.log(window.location.hostname+':3977/home')
                window.location.href='http://'+window.location.hostname+':'+window.location.port+'/home'
              }
            },
            error =>{
              this.message.error('Credenciales incorrectas', 'Revise si su usuario y/o contraseña es correcto')
            }
          )          
        }   
      },
      error =>{
        this.message.error('Credenciales incorrectas', 'Revise si su usuario y/o contraseña es correcto')
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
  globalSearch(val:string){
    if(val.length >= 3){
      this.valSearch = val;
      this._globalService.getCountSearch(this.token, val, this.identity['company']['_id']).subscribe(
        response =>{
              this.searched = response;
              
        },
        error =>{
            console.error(error);
        }
      );
    }else{
      this.searched = undefined;
    }
  }

  wrapp(){
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    };
  }

  changeToRequester(){
    let identity = this.identity;
    identity['role'] = 'ROLE_REQUESTER';
    identity['company'] = null;
    identity['changedMode'] = true;
    localStorage.setItem('identity', JSON.stringify(identity));
    location.reload();

  }

  changeToAgent(){
    this._userService.getOne(this.token, this.identity['_id']).subscribe(
      response =>{
        if(response.user){
          localStorage.setItem('identity', JSON.stringify(response.user));
          location.reload();      
        }
      },
      error =>{
        console.error(error);
      }
    )
  }

}