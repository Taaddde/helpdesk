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
import { responseService } from 'app/shared/services/helpdesk/response.service';
import { Response } from 'app/shared/models/helpdesk/response';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  providers: [userService, sectorService, uploadService, responseService]
})
export class UserProfileComponent implements OnInit {

  public user: User;
  public token: string;
  public identity;
  public url: string;

  public role: string;

  public isAdmin: boolean;
  public isUser: boolean;
  public isNew: boolean;
  public password;

  public sectors: Sector[];
  public responseColumns = [];
  public responses = [];

  public newResponse: Response;

  constructor(
    private _userService: userService,
    private _sectorService: sectorService,
    private confirmService: AppConfirmService,
    private _uploadService: uploadService,
    private _responseService: responseService,
    private _route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private _router: Router
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
    this.url = GLOBAL.url;
    this.user = new User('',null ,'','',null,'','','',null,null, false,'', [],'','',null,true,'',true,true);
    this.newResponse = new Response('','','','');
    this.isAdmin = false;
    this.isUser = false;
    this.isNew = false;
    this.password = {
      new: '',
      confirm: ''
    };
  }

  ngOnInit() {
    this.getUser();
    this.getSectors();
    this.getColumns();
    this.getResponses();
  }

  getUser(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];
      this._userService.getOne(this.token, id).subscribe(
        response =>{
          if(response.user){
            this.user = response.user
            this.user.password = '';

            if((this.identity['role'] == 'ROLE_ADMIN' || (this.user.role == 'ROLE_REQUESTER' && this.identity['role'] == 'ROLE_AGENT')) && (this.identity['company'] && this.identity['company']['name'] == 'Sistemas')){
              this.isAdmin = true;
            }
            if(this.user._id == this.identity['_id']){
              this.isUser = true;
            }
            this.role = this.user.role;
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        })
    })
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

  getResponses(){
    this._responseService.getList(this.token, this.identity['_id']).subscribe(
      response =>{
          if(response.responses){
            this.responses = response.responses;
          }
      },
      error =>{
          this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  saveResponse(){
    if(this.newResponse.hashtag != '' && this.newResponse.resp != ''){
      this.newResponse.user = this.identity['_id'];
      this.newResponse.hashtag = '#'+this.newResponse.hashtag.replace(' ', '');
      this._responseService.add(this.token, this.newResponse).subscribe(
        response =>{
            if(response.response){
              this.openSnackBar('Respuesta automática añadida', 'Cerrar');
              this.getResponses();
              this.newResponse.hashtag = '';
              this.newResponse.resp = '';
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

  deleteResponse(event){
    if(event.type != 'click')
      return;

    this.confirmService.confirm({message: "¿Estas seguro que quieres eliminar "+event.row['hashtag']+"?"})
      .subscribe(res => {
        if (res) {
          this._responseService.delete(this.token, event.row['_id']).subscribe(
            response =>{
                if(response.response){
                  this.getResponses();
                  this.openSnackBar('Respuesta automática eliminada', 'Cerrar');
                }
            },
            error =>{
                this.openSnackBar(error.message, 'Cerrar');
            }
          );
        }
      })
  }

  setSector(val){
    this.user.sector = val;
    this.editUser();
  }

  getColumns(){
    this.responseColumns = [
      {
        prop: 'hashtag',
        name: 'Nombre',
        flexGrow: 1
      },
      {
        prop: 'resp',
        name: 'Respuesta',
        flexGrow: 4
      },
    ];
  }

  editUser(){
    if(
      this.user.name != '' && 
      this.user.surname != '' && 
      this.user.userName != '' && 
      this.user.email != ''
      ){
      if(this.user.sign = ''){
        this.user.sign = null
      }

      let pass: string = '';

      if(this.password.new != this.password.confirm)
        return this.openSnackBar('La nueva contraseña no coincide con su confirmación', 'Cerrar')
      else{
        if(this.password.new != '')
          pass = this.user.password;
      }

      delete this.user.password;
      let newPass = this.password.new;
      this.password.new = '';
      this.password.confirm = '';

      this._userService.edit(this.token, this.user).subscribe(
        resp =>{
            if(resp.user){
                if(newPass != ''){
                  if(this.isAdmin){
                    this._userService.edit(this.token, {_id: this.user._id, password: newPass}).subscribe(
                      r =>{
                        this.openSnackBar('Datos actualizados', 'Cerrar');
                        this.getUser();
                      },
                      error =>{}
                    );
                  }else{
                    this._userService.login({userName: this.user.userName, password: pass}).subscribe(
                      response =>{
                        if(response.user){
                          this._userService.edit(this.token, {_id: this.user._id, password: newPass}).subscribe(
                            r =>{
                              this.openSnackBar('Datos actualizados', 'Cerrar');
                              this.getUser();
                            },
                            error =>{}
                          );
                        }else{
                          this.openSnackBar('La contraseña actual no es la correcta.', 'Cerrar')
                        }
                      },
                      error =>{
                        this.openSnackBar('La contraseña actual no es la correcta.', 'Cerrar')
                      }
                    )
                  }
                }else{
                  this.openSnackBar('Datos actualizados', 'Cerrar');
                  this.getUser();
                }
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

  delete(){
    this.confirmService.confirm({message: `¿Estas seguro que quieres eliminar a ${this.user.name} ${this.user.surname}?`})
    .subscribe(res => {
      if(res){
        let delQuery = {_id: this.user._id, deleted: true};
        this._userService.edit(this.token, delQuery).subscribe(
            response =>{
              if(this.user.role != 'ROLE_REQUESTER')
                this._router.navigateByUrl('/user/list/agent');
              else
                this._router.navigateByUrl('/user/list/requester');

              this.openSnackBar('Usuario eliminado', 'Cerrar');
            },
            error =>{
              this.openSnackBar(error.message, 'Cerrar');
            }
        );
      }
    })
  }

  openAttachment() {
    document.getElementById('attachment').click();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  setPermit(type: string, checked: boolean){
    if(checked)
      this.user.permits.push(type);
    else
      this.user.permits.splice(this.user.permits.indexOf(type), 1);
  }

  changeAdm(value){
    if(value == true){
      this.user.role = 'ROLE_ADMIN';
    }else{
      this.user.role = this.role;
    }
  }

  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
    this.filesToUpload = <Array<File>>fileInput.target.files;


    this._uploadService.makeFileRequest(this.url+'user/image/'+this.user._id, [], this.filesToUpload, this.token, 'image');
    setTimeout(() => {
      this.getUser();
      this.openSnackBar('Foto de perfil actualizada', 'Cerrar')
    }, 1000);
    
  }

}