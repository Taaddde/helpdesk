import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'

import { userService } from '../../services/user.service';
import { ticketService } from '../../services/ticket.service';
import { teamService } from '../../services/team.service';
import { textblockService } from '../../services/textblock.service';
import { Ticket } from '../../models/ticket';
import { TextBlock } from '../../models/textblock';
import { Team } from '../../models/team';
import { User } from '../../models/user';
import { uploadService } from '../../services/upload.service';

declare var $: any;



@Component({
  selector: 'app-ticket-new',
  templateUrl: './ticket-new.component.html',
  styleUrls: ['../../styles/form.scss'],
  providers: [userService, ticketService, teamService, textblockService, uploadService]
})
export class TicketNewComponent implements OnInit {

  public ticket: Ticket;
  public textblock: TextBlock;

  public teams: Team[];
  public team: Team

  public agents: User[];
  public agent: User;
  public requesters: User[];
  public allRequesters: User[];
  public requester: User;
  public nreq: User;

  public priority: string;
  public keyPress: boolean;
  public requesterFilter: string;

  public identity;
  public token;
  public url: string;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _ticketService: ticketService,
    private _teamService: teamService,
    private _textblockService: textblockService,
    private _uploadService: uploadService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

    this.priority = '';
    this.keyPress = false;
    this.requesterFilter = '';

    this.ticket = new Ticket('','',null,'',null,null,'','','',null,null,'',[null],'',this.identity['company']['_id'],'',[''],null,null,'');
    this.textblock = new TextBlock('','',this.identity['_id'],'','','',[''],false);
    this.nreq = new User('','','','','','','ROLE_REQUESTER','','null','',false,'');
   }

  ngOnInit() {
    this.getRequesters();
    this.getTeams();
  }

  getTeams(){
    this._teamService.getList(this.token, this.identity['company']['_id']).subscribe(
      response =>{
          if(!response.teams){
            this._router.navigate(['/']);
          }else{
            this.teams = response.teams;
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

  getRequesters(){
    this._userService.getListReq(this.token, this.identity['company']['_id']).subscribe(
      response =>{
          if(response.users){
            this.requesters = response.users;
            this.allRequesters = response.users;
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

  createRequester(){
    this.nreq = new User('','','','','','','ROLE_REQUESTER','','null','',false,'');
  }


  setStatus(val:string){
    this.priority = val;
  }

  setPriority(val:string){
    this.priority = val;
  }

  setTeam(team){
    this.agent = undefined;
    this.ticket.agent = null;
    this.agents = team.users;
    this.team = team;
    this.ticket.team = team._id;
    this.ticket.company = team.company._id;
  }

  setAgent(agent){
    this.agent = agent;
    this.ticket.agent = agent._id;
  }

  setRequester(requester){
    this.requesterFilter = '';
    this.requester = requester;
    this.ticket.requester = requester._id;
  }

  filterRequester(){
    if(this.requesterFilter.length >= 3){
      this.keyPress = true;
    } else{
      this.keyPress = false;
    }

    this.requesters = this.allRequesters.filter(requester =>{
      return (requester['name']+requester['surname']).toLowerCase().includes(this.requesterFilter.toString().toLowerCase());
    })
  }

  onSubmit(){

    this.ticket.priority = this.priority;
    this.ticket.source = 'MANUAL';
    this.textblock.type = 'PUBLIC'
    if(this.team){
      this.ticket.status = 'Pendiente';
    }else{
      this.ticket.status = 'Abierto';
    }
    if(this.ticket.priority == ''){
      this.ticket.priority = 'Normal';
    }
    if(this.ticket.agent == null){
      delete this.ticket.agent;
    }

    if(this.ticket.team == null){
      delete this.ticket.team;
    }
    delete this.ticket.subTypeTicket;
    delete this.ticket.rating;

      //Se crea un ticket con un solicitante ya existente
      if(this.requester){
        delete this.requester.company;
        this._ticketService.add(this.token,this.ticket).subscribe(
          response =>{
              if(!response.ticket){
                alert('Error al crear el ticket')
              }else{
                //TextBlock
                this.textblock.ticket = response.ticket._id;
            
                this._textblockService.add(this.token,this.textblock).subscribe(
                  response =>{
                      if(!response.textblock){
                        alert('Error en el bloque de texto del ticket')
                      }else{
                        console.log(this.filesToUpload)
                        if(this.filesToUpload){
                            this._uploadService.makeFileRequest(this.url+'textblock/file/'+response.textblock._id, [], this.filesToUpload, this.token, 'file')
                            .then(
                                result =>{
                                }, 
                                error =>{
                                    console.error(error);
                                }
                            );
                        }
                        this._router.navigate(['/ticket-gestion',response.textblock.ticket]);       
                      }
                    },
                    error =>{
                        console.error(error);
                    }
                  );
              }
          },
          error =>{
              console.error(error);
          }
        );
      }else{
        alert('Selecciona un solicitante')
      }
  }

  submitRequester(){
    delete this.nreq.company;
    this._userService.add(this.token, this.nreq).subscribe(
      response =>{
          if(!response.user){
            alert('Error al crear el solicitante')
          }else{
            this.setRequester(response.user);
            $("#createRequester").modal("hide");
          }
      },
      error =>{
          var errorMessage = <any>error;
          if(errorMessage != null){
            alert(errorMessage.error.message);
          }
      });
  }

  cleanAttach(){
    this.filesToUpload = undefined;
  }

  focus(){
    setTimeout(() => 
      {
        document.getElementById("searchrequester").focus();
      },
      1);
  }

  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}
