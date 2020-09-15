import { Component, OnInit } from '@angular/core';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubTypeTicket } from 'app/shared/models/helpdesk/subtypeticket';
import { subTypeTicketService } from 'app/shared/services/helpdesk/subtypeticket.service';
import { Params, ActivatedRoute } from '@angular/router';
import { teamService } from 'app/shared/services/helpdesk/team.service';
import { Team } from 'app/shared/models/helpdesk/team';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
declare var $: any;

@Component({
  selector: 'app-subtype',
  templateUrl: './subtype.component.html',
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    userService, subTypeTicketService, teamService
  ],
})
export class SubTypeEditComponent implements OnInit {

  public token: string;
  public identity;

  public subtype: SubTypeTicket;
  public teams: Team[];

  public isAdmin: boolean = false;
  public check: string;

  constructor(
    private _userService: userService,
    private _teamService: teamService,
    private confirmService: AppConfirmService,
    private _route: ActivatedRoute,
    private _subTypeTicketService: subTypeTicketService,
    private snackBar: MatSnackBar,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
    this.subtype = new SubTypeTicket('','','',null,'',[],null,false,'','','', false,null);
    this.check = '';
   }

  ngOnInit() {
    this.getSubType();
    this.getTeams();

    if(this.identity['role'] == 'ROLE_ADMIN'){
      this.isAdmin = true;
    }
  }

  getSubType(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];
      this._subTypeTicketService.getOne(this.token, id).subscribe(
        response =>{
          if(response.subTypeTicket){
            this.subtype = response.subTypeTicket;
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
      })
    })
  }

  getTeams(){
    this._teamService.getList(this.token, this.identity['company']['_id']).subscribe(
      response =>{
          if(response.teams){
            this.teams = response.teams;
          }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  setTeam(val){
    this.subtype.team = val;
  }

  submit(){
    if(this.subtype.name != ''){
      this._subTypeTicketService.edit(this.token, this.subtype._id, this.subtype).subscribe(
        response =>{
            if(response.subTypeTicket){
                this.openSnackBar('Datos actualizados', 'Cerrar')
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

  deleteCheck(val:string){
    this.confirmService.confirm({message: `¿Estas seguro que quieres eliminar esta validación?`})
      .subscribe(res => {
        if (res) {
          this._subTypeTicketService.deleteCheck(this.token, this.subtype._id, val).subscribe(
            response =>{
                if(response.check){
                  this.subtype.checks.splice(this.subtype.checks.indexOf(val),1); 
                  this.openSnackBar('Validación eliminada', 'Cerrar');
                }
            },
            error =>{
              this.openSnackBar(error.message, 'Cerrar');
            }
          )
        }
    })
  }

  addCheck(){
    this._subTypeTicketService.addCheck(this.token, this.subtype._id, this.check).subscribe(
      response =>{
          if(response.subTypeTicket){
            this.subtype.checks.push(this.check);
            this.check = '';
            this.openSnackBar('Validación agregada', 'Cerrar');
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
