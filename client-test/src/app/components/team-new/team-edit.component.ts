import { Component, OnInit } from '@angular/core';
import { userService } from '../../services/user.service';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { uploadService } from '../../services/upload.service';
import { Team } from '../../models/team';
import { teamService } from '../../services/team.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-team-new',
  templateUrl: './team-new.component.html',
  styleUrls: ['../../styles/form.scss'],
  providers: [userService, uploadService, teamService]
})
export class TeamEditComponent implements OnInit {

  public team: Team;
  public identity;
  public token;
  public url: string;
  public isDefault: boolean;

  public selectedOut: string;
  public selectedIn: string;

  public alertMessage: string;

  public usersInTeam: User[];
  public usersOutTeam: User[];


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _uploadService: uploadService,
    private _teamService: teamService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.team = new Team('','',[''],'null','','');
    this.isDefault = false;
    this.alertMessage = '';

    this.selectedOut = '';
    this.selectedIn = '';

    this.usersInTeam = [];
    this.usersOutTeam = [];

   }

  ngOnInit() {
    this.getTeam();
    this.getAgents();
  }

  getTeam(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];
      this._teamService.getOne(this.token, id).subscribe(
        response =>{
            if(!response.team){
              this._router.navigate(['/']);
            }else{
              this.team = response.team;
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
  })
  }

  getAgents(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];
      this._teamService.getAgentsList(this.token, id, this.identity['company']['_id']).subscribe(
        response =>{
            if(!response.usersOut && !!response.usersIn){
              this._router.navigate(['/']);
            }else{
              this.usersInTeam = response.usersIn;
              this.usersOutTeam = response.usersOut;
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
    })
  }

  onSubmit(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];
      this._teamService.edit(this.token, id, this.team).subscribe(
        response =>{
            if(!response.team){
                this.alertMessage = 'Error en el servidor';
            }else{
                    if(!this.filesToUpload){
                        this._router.navigate(['/agent']);
                    }else{
                        this._uploadService.makeFileRequest(this.url+'team/image/'+response.team._id, [], this.filesToUpload, this.token, 'image')
                        .then(
                            result =>{
                              this._router.navigate(['/agent']);
                            }, 
                            error =>{
                              console.error(error)
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
            console.error(error);
          }
        }
      );
    });
  }

  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }


  selectOut(val: string){
    this.selectedOut = val;
  }

  selectIn(val: string){
    this.selectedIn = val;
  }

  include(){
    if(this.selectedOut){
      this._route.params.forEach((params: Params) =>{
        let id = params['id'];
        this._teamService.addUser(this.token, id,this.selectedOut).subscribe(
          response =>{
              if(!response.team){
                  this.alertMessage = 'Error en el servidor';

              }else{
                this.selectedOut = '';
                    this.getAgents();
              }
          },
          error =>{
            var errorMessage = <any>error;
            if(errorMessage != null){
              var body = JSON.parse(error._body);
              this.alertMessage = body.message;
              console.error(error);
            }
          }
        );
      });
    }
  }

  exclude(){
    if(this.selectedIn){
      this._route.params.forEach((params: Params) =>{
        let id = params['id'];
        this._teamService.removeUser(this.token, id,this.selectedIn).subscribe(
          response =>{
              if(!response.team){
                  this.alertMessage = 'Error en el servidor';
              }else{
                this.selectedIn = '';
                this.getAgents();
              }
          },
          error =>{
            var errorMessage = <any>error;
            if(errorMessage != null){
              var body = JSON.parse(error._body);
              this.alertMessage = body.message;
              console.error(error);
            }
          }
        );
      });
    }
    
  }
}
