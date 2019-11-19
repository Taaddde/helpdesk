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
export class TeamNewComponent implements OnInit {

  public team: Team;
  public identity;
  public token;
  public url: string;
  public isDefault: boolean;

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
    this.team = new Team('','',[''],'null','',this.identity['company']['_id']);
    this.isDefault = false;
    this.alertMessage = '';


    this.usersInTeam = [];
    this.usersOutTeam = [];

   }

  ngOnInit() {
    
  }

  onSubmit(){
    this._teamService.add(this.token,this.team).subscribe(
      response =>{
          if(!response.team){
              this.alertMessage = 'Error en el servidor';
          }else{
                  if(!this.filesToUpload){
                      this._router.navigate(['/team/edit',response.team._id]);
                  }else{
                      this._uploadService.makeFileRequest(this.url+'team/image/'+response.team._id, [], this.filesToUpload, this.token, 'image')
                      .then(
                          result =>{
                            this._router.navigate(['/team/edit',response.team._id]);
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
