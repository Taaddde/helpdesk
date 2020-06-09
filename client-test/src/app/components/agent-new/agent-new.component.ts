import { Component, OnInit } from '@angular/core';
import { userService } from '../../services/user.service';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { User } from '../../models/user';
import { uploadService } from '../../services/upload.service';
import { sectorService } from 'src/app/services/sector.service';
import { Sector } from 'src/app/models/sector';

@Component({
  selector: 'app-agent-new',
  templateUrl: './agent-new.component.html',
  styleUrls: ['../../styles/form.scss'],
  providers: [userService, uploadService, sectorService]
})
export class AgentNewComponent implements OnInit {

  public user: User;
  public identity;
  public token;
  public url: string;
  public isAdm: boolean;

  public isUser: boolean;

  public sectors: Sector[];

  public alertMessage: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _uploadService: uploadService,
    private _sectorService: sectorService,

  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.user = new User('',undefined,'','',undefined,'','','','',false,'','','null',this.identity['company']['_id'],false,'', true, true);
    this.isAdm = false;
    this.isUser = true;
    this.alertMessage = '';
   }

  ngOnInit() {
    this.getSectors();

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
      if(!this.isAdm){
        this.user.role = 'ROLE_AGENT';
      }else{
        this.user.role = 'ROLE_ADMIN';
      }
  
      if(this.user.userName == ''){
        delete this.user.userName;
        delete this.user.password;
      }
  
      if(this.user.sector == ''){
        delete this.user.sector;
      }
  
      this._userService.add(this.token,this.user).subscribe(
        response =>{
            if(!response.user){
                this.alertMessage = 'Error en el servidor';
            }else{
                    if(!this.filesToUpload){
                        this._router.navigate(['/agent']);
                    }else{
                        this._uploadService.makeFileRequest(this.url+'user/image/'+response.user._id, [], this.filesToUpload, this.token, 'image')
                        .then(
                            result =>{
                                this._router.navigate(['/agent']);
                            }, 
                            error =>{
                            }
                        );
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
