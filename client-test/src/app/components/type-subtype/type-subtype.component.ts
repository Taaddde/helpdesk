import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'
import { userService } from '../../services/user.service';
import { TypeTicket } from '../..//models/typeticket';
import { SubTypeTicket } from '../..//models/subtypeticket';
import { typeTicketService } from '../..//services/typeticket.service';
import { subTypeTicketService } from '../..//services/subtypeticket.service';
import { teamService } from '../..//services/team.service';
import { Team } from '../..//models/team';
import {GLOBAL} from '../../services/global';

declare var $: any;

@Component({
  selector: 'app-type-subtype',
  templateUrl: './type-subtype.component.html',
  styleUrls: ['./type-subtype.component.scss'],
  providers:[userService, typeTicketService, subTypeTicketService, teamService]
})
export class TypeSubtypeComponent implements OnInit {

  public identity;
  public token;
  public url;

  public types: TypeTicket[];
  public subtypes: SubTypeTicket[];
  public newType: TypeTicket;
  public newSubtype: SubTypeTicket;

  public typeSelected: string;
  public subtypeSelected: SubTypeTicket;
  public subtypeTeamSelected: string;

  public teams: Team[];
  public teamSelected: string;

  public check: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _typeTicketService: typeTicketService,
    private _subTypeTicketService: subTypeTicketService,
    private _teamService: teamService,

  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.newType = new TypeTicket('','',this.identity['company']['_id']);
    this.newSubtype = new SubTypeTicket('','','',0,'',String[''],0,false, '');
    this.typeSelected = ''
    this.subtypeSelected = new SubTypeTicket('','','',0,'',String[''],0,false,'');
    this.teamSelected = '';
    this.subtypeTeamSelected = '';
    this.check = '';
   }
 
  ngOnInit() {
    this.getTypes();
    this.getTeams();
  }

  getTeams(){
    this._teamService.getList(this.token,this.identity['company']['_id']).subscribe(
      response =>{
          if(!response.teams){
              alert('Error en el servidor');
          }else{
            this.teams = response.teams;
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  getTypes(){
    this._typeTicketService.getList(this.token,this.identity['company']['_id']).subscribe(
      response =>{
          if(!response.typeTickets){
              alert('Error en el servidor');
          }else{
            this.types = response.typeTickets;
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  selectType(val:string){
    if(this.typeSelected == val){
      this.typeSelected = '';
    }else{
      this.typeSelected = val;
      this.getSubTypes();
    }
   
  }

  selectTeam(id: string, name:string){
    this.teamSelected = name;
    this.newSubtype.team = id;
  }

  selectSubtype(val){
    this.subtypeSelected = val;
    this.subtypeTeamSelected = val.team.name;
  }

  confirmSubtype(){
    this._subTypeTicketService.edit(this.token, this.subtypeSelected._id, this.subtypeSelected).subscribe(
      response =>{
          if(!response.subTypeTicket){
              alert('Error en el servidor');
          }else{
            this.cancelSubtype();
            this.getSubTypes();
          }
      },
      error =>{
          console.error(error);
      }
    );

    
  }

  delete(val: SubTypeTicket){
    var r = confirm("¿Estas seguro que quieres eliminar el subtipo "+val.name+"?");
    if (r == true) {
      this._subTypeTicketService.delete(this.token, val._id).subscribe(
        response =>{
            if(!response.subTypeTicket){
                alert('Error en el servidor');
            }else{
              this.getSubTypes();
            }
        },
        error =>{
            console.error(error);
        }
      );
  
    }
  }

  deleteCheck(val:string){
    var r = confirm("¿Estas seguro que quieres eliminar esta validación? "+val);
    if (r == true) {
      this._subTypeTicketService.deleteCheck(this.token, this.subtypeSelected._id, val).subscribe(
        response =>{
            if(!response.check){
                alert('Error en el servidor');
            }else{
              this.subtypeSelected.checks.splice(this.subtypeSelected.checks.indexOf(val),1); 
            }
        },
        error =>{
            console.error(error);
        }
      );
  
    }
  }


  cancelSubtype(){
    this.subtypeSelected =  new SubTypeTicket('','','',0,'',String[''],0,false,'');
    this.getSubTypes();
    this.subtypeTeamSelected = null;

  }

  cancelValidation(){
    this.subtypeSelected =  new SubTypeTicket('','','',0,'',String[''],0,false,'');
    $("#newsubtype").modal("hide");
  }

  getSubTypes(){
    this._subTypeTicketService.getList(this.token, this.typeSelected).subscribe(
      response =>{
          if(!response.subTypeTickets){
              alert('Error en el servidor');
          }else{
            this.subtypes = response.subTypeTickets;
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  getLenght(val: Array<string>){
    return val.length;
  }

  setValidation(val: SubTypeTicket){
    this.subtypeSelected = val;
  }

  onSubmit(){
    this.newSubtype.typeTicket = this.typeSelected;
    if(this.newSubtype.team == ''){
      delete this.newSubtype.team;
    }

    this._subTypeTicketService.add(this.token, this.newSubtype).subscribe(
      response =>{
          if(!response.subTypeTicket){
              alert('Error en el servidor');
          }else{
            this.newSubtype = new SubTypeTicket('','','',0,'',String[''],0,false,'');
            this.getSubTypes();
          }
      },
      error =>{
          console.error(error);
      }
    );

  }


  typeSubmit(){
    this._typeTicketService.add(this.token, this.newType).subscribe(
      response =>{
          if(!response.typeTicket){
              alert('Error en el servidor');
          }else{
            this.newType = new TypeTicket('','',this.identity['company']['_id']);
            this.getTypes();
            $("#newtype").modal("hide");
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  subtypeSubmit(){
    this._subTypeTicketService.addCheck(this.token, this.subtypeSelected._id, this.check).subscribe(
      response =>{
          if(!response.subTypeTicket){
              alert('Error en el servidor');
          }else{
            this.subtypeSelected.checks.push(this.check);
            this.check = '';
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  checkSubmit(){
    this._subTypeTicketService.edit(this.token, this.subtypeSelected._id, this.subtypeSelected).subscribe(
      response =>{
          if(!response.subTypeTicket){
              alert('Error en el servidor');
          }else{
            this.subtypeSelected.checks.push(this.check);
            this.check = '';
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  saveSubtype(){
    this._subTypeTicketService.edit(this.token, this.subtypeSelected._id, this.subtypeSelected).subscribe(
      response =>{
          if(!response.subTypeTicket){
              alert('Error en el servidor');
          }else{
            this.cancelValidation();
          }
      },
      error =>{
          console.error(error);
      }
    );
  }



}
