import { Component, OnInit } from '@angular/core';
import { userService } from '../../services/user.service';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { User } from '../../models/user';
import { uploadService } from '../../services/upload.service';

@Component({
  selector: 'app-agent-new',
  templateUrl: './agent-new.component.html',
  styleUrls: ['../../styles/form.scss'],
  providers: [userService, uploadService]
})
export class AgentNewComponent implements OnInit {

  public user: User;
  public identity;
  public token;
  public url: string;
  public isAdm: boolean;

  public alertMessage: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _uploadService: uploadService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.user = new User('','','','','','','','','null',this.identity['company']['_id'],false);
    this.isAdm = false;
    this.alertMessage = '';
   }

  ngOnInit() {
  }

  onSubmit(){
    if(!this.isAdm){
      this.user.role = 'ROLE_AGENT';
    }else{
      this.user.role = 'ROLE_ADMIN';
    }

    if(this.user.userName = ''){
      delete this.user.userName;
      delete this.user.password;
    }


    this._userService.add(this.user).subscribe(
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
                              console.log('Error');
                          }
                      );
                  }
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
    );
  }

  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}