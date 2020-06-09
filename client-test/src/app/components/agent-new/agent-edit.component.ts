import { Component, OnInit } from '@angular/core';
import { userService } from '../../services/user.service';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { User } from '../../models/user';
import { uploadService } from '../../services/upload.service';
import { sectorService } from 'src/app/services/sector.service';
import { Sector } from 'src/app/models/sector';

@Component({
  selector: 'app-agent-edit',
  templateUrl: './agent-new.component.html',
  styleUrls: ['../../styles/form.scss'],
  providers: [userService, uploadService, sectorService]
})
export class AgentEditComponent implements OnInit {

  public user: User;
  public identity;
  public token;
  public url: string;
  public isAdm: boolean;

  public alertMessage: string;

  public isUser: boolean;

  public sectors: Sector[];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _sectorService: sectorService,
    private _uploadService: uploadService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.user = new User('',undefined,'','',undefined,'','','','',false,'','','','', false,'', true, true);
    this.isAdm = false;
    this.isUser = false;
    this.alertMessage = '';
   }

  ngOnInit() {
    this.getUser();
    this.getSectors();
    console.log(this.identity['role'])
  }

  getUser(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];

      if(this.identity['_id'] == id){
        this.isUser = true;
      }

    this._userService.getOne(this.token, id).subscribe(
      response =>{
          if(!response.user){
            this._router.navigate(['/']);
          }else{
            this.user = response.user;
            document.getElementById('editable').innerHTML = this.user.sign;
            if(this.user.role == 'ROLE_AGENT'){
              this.isAdm = false;
            }else{
              if(this.user.role == 'ROLE_ADMIN'){
                this.isAdm = true;
              }
            }
            this.user.password = '';
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
    });
  }

  setSector(value){
    this.user.sector = value;
  }

  getSectors(){
    this._sectorService.getList().subscribe(
      response =>{
          if(response.sectors){
            this.sectors = response.sectors;
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

  onSubmit(){
    if(this.user.name != '' && this.user.surname != '' && this.user.userName != '' && this.user.email != ''){
      if(this.user.role != 'ROLE_REQUESTER'){
        if(this.identity['role'] != 'ROLE_REQUESTER'){
          if(!this.isAdm){
            this.user.role = 'ROLE_AGENT';
          }else{
            this.user.role = 'ROLE_ADMIN';
          }
        }  
      }
      
      if(this.user.sign = ''){
        this.user.sign = null
      }
  
      if(this.user.password == ''){
        delete this.user.password;
      }
    
      this._userService.edit(this.token, this.user).subscribe(
        response =>{
            if(!response.user){
                this.alertMessage = 'Error en el servidor';
            }else{
                if(this.filesToUpload){
                    this._uploadService.makeFileRequest(this.url+'user/image/'+response.user._id, [], this.filesToUpload, this.token, 'image')
                }
                if(this.identity['role'] != 'ROLE_REQUESTER'){
                  this._router.navigate(['/agent']);
                }else{
                  this._router.navigate(['/home']);
                }
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
    }else{
      alert('Faltan campos para completar');
    }
    
  }

  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
