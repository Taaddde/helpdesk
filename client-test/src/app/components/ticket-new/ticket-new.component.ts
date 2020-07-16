import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MessageComponent } from '../message/message.component';
import { Sector } from 'src/app/models/sector';
import { sectorService } from 'src/app/services/sector.service';

declare var $: any;



@Component({
  selector: 'app-ticket-new',
  templateUrl: './ticket-new.component.html',
  styleUrls: ['../../styles/form.scss'],
  providers: [userService, ticketService, sectorService, teamService, textblockService, uploadService, MessageComponent]
})
export class TicketNewComponent implements OnInit {

  @ViewChild(MessageComponent, {static:false}) message: MessageComponent;
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

  public sectors: Sector[];

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
    private _uploadService: uploadService,
    private _sectorService: sectorService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

    this.priority = '';
    this.keyPress = false;
    this.requesterFilter = '';

    this.ticket = new Ticket('','',null,'',null,null,'','','',null,null,'',[null],'',this.identity['company']['_id'],'',[''],null,null,'');
    this.textblock = new TextBlock('','',this.identity['_id'],'','','',[''],false);
    this.nreq = new User('',undefined,'','',undefined,'','','','',false,'ROLE_REQUESTER','','null','',false,'', true, true);
    this.message = new MessageComponent();
   }

  ngOnInit() {
    this.getRequesters();
    this.getTeams();
    this.getSectors();
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

  setSector(value){
    this.nreq.sector = value;
  }

  getSectors(){
    this._sectorService.getList(this.token).subscribe(
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


  createRequester(){
    this.nreq = new User('',undefined,'','',undefined,'','','','',false,'ROLE_REQUESTER','','null','',false,'', true, true);
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

    if(this.ticket.sub != '' && this.textblock.text!= ''){
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
          this.message.error('Faltan campos a completar', 'Selecciona un solicitante para poder finalizar el ticket');
        }
  
    }else{
      this.message.error('Faltan campos a completar', 'Los campos de asunto y descripción son obligatorios');
    }

  }

  submitRequester(){
    delete this.nreq.company;
    if(this.nreq.sector == ''){
      delete this.nreq.sector;
    }
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

  public imagesToUpload: Array<File> = new Array<File>();
  async pastePicture(event: ClipboardEvent) {
    if(event.clipboardData.files.length != 0){
      this.imagesToUpload = new Array<File>();

      this.imagesToUpload.push(event.clipboardData.files.item(0));
  
      await this._uploadService.makeFileRequest(this.url+'textblock/image', [], this.imagesToUpload, this.token, 'image')
      .then(data =>{
        let antiEdit = document.getElementById('antieditable');
        antiEdit.parentNode.removeChild(antiEdit);
        document.getElementById('editable').innerHTML += '<a target="_blank" href="'+this.url+'textblock/image/'+data['filename']+'"><img src="'+this.url+'textblock/image/'+data['filename']+'" class="img-fluid" style="width: 80%; margin: 5px" alt="Responsive image"></a>';
        document.getElementById('editable').innerHTML += '<span id="antieditable" contentEditable="false"></span>';
      })
  
      this.textblock.text = document.getElementById('editable').innerHTML;
      this.imagesToUpload = new Array<File>();
    }
  }



  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}
