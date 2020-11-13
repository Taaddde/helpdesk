import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { User } from 'app/shared/models/helpdesk/user';
import { sectorService } from 'app/shared/services/helpdesk/sector.service';
import { Sector } from 'app/shared/models/helpdesk/sector';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { uploadService } from 'app/shared/services/helpdesk/upload.service';
import { Response } from 'app/shared/models/helpdesk/response';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  providers: [userService, sectorService, uploadService]
})
export class NewUserComponent implements OnInit {

  public user: User;
  public token: string;
  public identity;
  public url: string;

  public isNew: boolean;
  public isUser: boolean;
  public isAdmin: boolean;

  public sectors: Sector[];
  public newResponse: Response;

  constructor(
    private _userService: userService,
    private _sectorService: sectorService,
    private _uploadService: uploadService,
    private _route: ActivatedRoute,
    private _router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
    this.url = GLOBAL.url;
    this.user = new User('',null ,'','',null,'','','',null,null, false,'', ["HELPDESK"],'','',null,true,'',true,true);
    this.isNew = true;
    this.isUser = true;
    this.isAdmin = true;

    this.newResponse = new Response('','','','');

  }

  ngOnInit() {
    this.getUser();
    this.getSectors();
  }

  getUser(){
    this._route.params.forEach((params: Params) =>{
      let type = params['type'];
      if(type == 'requester'){
          this.user.role = 'ROLE_REQUESTER';
      }else{
          this.user.role = 'ROLE_AGENT';
          this.user.company = this.identity['company']['_id'];
      }
    })
  }

  delete(){}

  editUser(){
    if(
      this.user.name != '' && 
      this.user.surname != '' && 
      this.user.userName != '' && 
      this.user.email != '' &&
      this.user.password != ''
      ){
      
      if(this.user.sign == ''){
        this.user.sign = null
      }
      
      this._userService.add(this.token, this.user).subscribe(
        response =>{
            if(response.user){
                this.openSnackBar('Usuario creado', 'Cerrar')
                this._router.navigate(['/user/profile/', response.user._id]);
            }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
      );
    }else{
      this.openSnackBar('Faltan campos para completar', 'Cerrar');
    }
  }


  getSectors(){
    this._sectorService.getList(this.token).subscribe(
      response =>{
          if(response.sectors){
            this.sectors = response.sectors;
          }
      },
      error =>{
          this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  setSector(val){
    this.user.sector = val;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  changeAdm(value){
    if(value == true){
      this.user.role = 'ROLE_ADMIN';
    }else{
      this.user.role = 'ROLE_AGENT';
    }
  }

  setPermit(type: string, checked: boolean){
    if(checked)
      this.user.permits.push(type);
    else
      this.user.permits.splice(this.user.permits.indexOf(type), 1);
  }

}