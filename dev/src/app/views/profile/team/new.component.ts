import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { teamService } from 'app/shared/services/helpdesk/team.service';
import { Team } from 'app/shared/models/helpdesk/team';

@Component({
  selector: 'app-new-team-profile',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  providers: [userService, teamService]
})
export class NewTeamComponent implements OnInit {

  public team: Team;
  public identity;
  public isAdmin: boolean;
  public token;
  public url: string;
  public isNew: boolean;

  constructor(
    private _userService: userService,
    private _teamService: teamService,
    private _route: ActivatedRoute,
    private _router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.team = new Team('','',[''],'null','',this.identity['company']['_id']);
    this.isAdmin = true;
    this.isNew = true;
  }

  ngOnInit() {}

  onSubmit(){
    this._teamService.add(this.token, this.team).subscribe(
        response =>{
            if(response.team){
                this.openSnackBar('Equipo creado', 'Cerrar')
                this._router.navigate(['/user/team/', response.team._id]);
            }
        },
        error =>{
            this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

}