import { Component, OnInit } from '@angular/core';
import { userService } from 'src/app/services/user.service';
import { chatService } from 'src/app/services/chat.service';
import { User } from 'src/app/models/user';
import { sectorService } from 'src/app/services/sector.service';
import { Sector } from 'src/app/models/sector';
declare var $: any;

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
  providers:[userService, sectorService]

})
export class RegisterUserComponent implements OnInit {

  public title = 'Mesa de ayuda';
  public user: User;
  public sectors: Sector[];

  //Asigna un valor a una propiedad
  constructor(
    private _userService: userService,
    private _sectorService: sectorService,
  ){
    this.user = new User('',undefined,'','',undefined,'','','','',false,'ROLE_REQUESTER','','',undefined, false,'', true, false);
  } 

  ngOnInit() {
    this.getSectors()
  }

  getSectors(){
    this._sectorService.getList().subscribe(
      response =>{
          if(response.sectors){
            this.sectors = response.sectors;
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  setSector(value){
    this.user.sector = value;
  }

  register(){
    if(this.user.name != '' && this.user.surname != '' && this.user.email != '' && this.user.sector != '' && this.user.password != ''){
      this.user.userName = this.user.name[0]+this.user.surname.replace(' ','');
      this.user.userName = this.user.userName.toLowerCase();
      this._userService.add('',this.user).subscribe(
        response =>{
            if(response.user){
              alert('Registro enviado con éxito, por favor, aguarde a que un agente apruebe su solicitud.');
              $("#register").modal("hide");

            }
        },
        error =>{
          var errorMessage = <any>error;
          if(errorMessage != null){
            var body = JSON.parse(error._body);
            alert(body.message);
          }
        }
      );
    }
  }

}
