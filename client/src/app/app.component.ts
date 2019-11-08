import { Component, OnInit, AfterViewInit } from '@angular/core';
import {User} from './models/user';

import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from './services/global';
import { userService } from './services/user.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { ticketService } from './services/ticket.service';
import { companyService } from './services/company.service';
import { typeTicketService } from './services/typeticket.service';
import { subTypeTicketService } from './services/subtypeticket.service';
import { Company } from './models/company';
import { TypeTicket } from './models/typeticket';
import { SubTypeTicket } from './models/subtypeticket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[userService, ticketService, companyService, typeTicketService, subTypeTicketService]
})
export class AppComponent implements OnInit {
  public title = 'HelpDesk';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public alertMessage;
  public url: string;
  public sub;
  public notifications;
  

  //Asigna un valor a una propiedad
  constructor(
    private _userService: userService,
    private _ticketService: ticketService,
    private _companyService: companyService,
    private _typeTicketService: typeTicketService,
    private _subTypeTicketService: subTypeTicketService,

    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.user = new User('','','','','','','ROLE_REQUESTER','','','');
    this.user_register = new User('','','','','','','ROLE_REQUESTER','','','');
    this.url=GLOBAL.url;
    this.alertMessage = '';
    this.notifications = '';
  
  } 

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    if(this.identity){
      if(this.identity['role'] != 'ROLE_REQUESTER'){
        this.getMessages();
        this.sub = Observable.interval(15000).subscribe((val) => { this.getMessages(); });
      }else{
        this.getMessagesReq();
        this.sub = Observable.interval(15000).subscribe((val) => { this.getMessagesReq(); });
      }
  
    }
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
          console.log(error);
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
          console.log(error);
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
          console.log(this.identity)
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
                this.user = new User('','','','','','','ROLE_REQUESTER','','','');
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

}
