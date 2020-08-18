import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { User } from 'app/shared/models/helpdesk/user';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { uploadService } from 'app/shared/services/helpdesk/upload.service';
import { teamService } from 'app/shared/services/helpdesk/team.service';
import { Team } from 'app/shared/models/helpdesk/team';

@Component({
  selector: 'app-team-profile',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  providers: [userService, teamService, uploadService]
})
export class TeamProfileComponent implements OnInit {

  public team: Team;
  public identity;
  public isAdmin: boolean;
  public isNew: boolean;
  public token;
  public url: string;
  public isDefault: boolean;

  public selectedOut: string;
  public selectedIn: string;

  public usersInTeam: User[];
  public usersOutTeam: User[];

  constructor(
    private _userService: userService,
    private _teamService: teamService,
    private _uploadService: uploadService,
    private _route: ActivatedRoute,
    private _router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.team = new Team('','',[''],'null','','');
    this.isDefault = false;

    this.selectedOut = '';
    this.selectedIn = '';

    this.usersInTeam = [];
    this.usersOutTeam = [];

    this.isAdmin = false;
    this.isNew = false;
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
            if(response.team){
              this.team = response.team;
              if(this.team.company['_id'] == this.identity['company']['_id'] && this.identity['role'] == 'ROLE_ADMIN'){
                this.isAdmin = true;
              }
            }
        },
        error =>{
            this.openSnackBar(error.message, 'Cerrar');
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
            this.openSnackBar(error.message, 'Cerrar');
        }
      );
    })
  }

  onSubmit(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];
      this._teamService.edit(this.token, id, this.team).subscribe(
        response =>{
            this.getTeam();
            this.openSnackBar('Datos actualizados', 'Cerrar');
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
      );
    });
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
              if(response.team){
                this.selectedOut = '';
                this.getAgents();
              }
          },
          error =>{
            this.openSnackBar(error.message, 'Cerrar');
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
              if(response.team){
                this.selectedIn = '';
                this.getAgents();
              }
          },
          error =>{
            this.openSnackBar(error.message, 'Cerrar');
          }
        );
      });
    }
    
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  openAttachment() {
    document.getElementById('attachment').click();
  }

  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
    this.filesToUpload = <Array<File>>fileInput.target.files;


    this._uploadService.makeFileRequest(this.url+'team/image/'+this.team._id, [], this.filesToUpload, this.token, 'image')
    setTimeout(() => {
      this.getTeam();
      this.openSnackBar('Foto de equipo actualizada', 'Cerrar')
    }, 1000);
    
  }

}