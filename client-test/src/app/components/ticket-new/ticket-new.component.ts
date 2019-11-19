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
import { IfObservable } from 'rxjs/observable/IfObservable';


@Component({
  selector: 'app-ticket-new',
  templateUrl: './ticket-new.component.html',
  styleUrls: ['./ticket-new.component.scss'],
  providers: [userService, ticketService, teamService, textblockService, uploadService]
})
export class TicketNewComponent implements OnInit {

  public ticket: Ticket;
  public textblock: TextBlock;

  public teams: [Team];
  public team: Team

  public agents: [User];
  public agent: User;
  public requesters: [User];
  public requester: User;

  public priority: string;
  public newRequester: boolean;

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
    this.newRequester = false;

    this.ticket = new Ticket('','',null,'',null,null,'','','',null,null,'',[null],'',this.identity['company']['_id'],'');
    this.textblock = new TextBlock('','',this.identity['_id'],'','','',[''],false)
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
          console.log(error);
          }
      }
    );
  }

  getRequesters(){
    this._userService.getListReq(this.token).subscribe(
      response =>{
          if(!response.users){
            console.log('Nada')
          }else{
            this.requesters = response.users;
          }
      },
      error =>{
          var errorMessage = <any>error;
          if(errorMessage != null){
          var body = JSON.parse(error._body);
          //this.alertMessage = body.message;
          console.log(error);
          }
      }
    );
  }

  createRequester(){
    this.requester = new User('','','','','','','ROLE_REQUESTER','','','',false);
    this.newRequester = true;
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
    this.requester = requester;
    this.ticket.requester = requester._id;
    this.newRequester = false;
  }
  unSetRequester(){
    this.requester = undefined;
    this.ticket.requester = undefined;
    this.newRequester = false;
  }


  onSubmit(){

    this.ticket.priority = this.priority;

    if(this.identity['role'] == 'ROLE_REQUESTER'){
      this.ticket.source = 'PORTAL';
      this.textblock.type = 'REQUEST'
    }else{
      this.ticket.source = 'MANUAL';
      this.textblock.type = 'PUBLIC'
    }

    if(this.agent){
      this.ticket.status = 'Pendiente';
    }else{
      this.ticket.status = 'Abierto';
    }

    if(this.ticket.priority == ''){
      this.ticket.priority = 'Normal';
      console.log('Pase por aca')
    }

    if(this.ticket.agent == null){
      delete this.ticket.agent;
    }

    if(this.ticket.team == null){
      delete this.ticket.team;
    }

    delete this.ticket.rating;

    if(this.newRequester){

      if(this.requester.userName == ''){
        delete this.requester.userName;
        delete this.requester.password;
      }

      //Se crea un ticket con un nuevo solicitante
      this._userService.add(this.requester).subscribe(
        response =>{
            if(!response.user){
              alert('Error al crear el solicitante')
            }else{

              //Ticket
              this.ticket.requester = response.user._id;

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
                              this._router.navigate(['/ticket-gestion',response.textblock.ticket]);       
                            }
                          },
                          error =>{
                              console.log(error);
                          }
                        );
                    }
                },
                error =>{
                    console.log(error);
                }
              );
            }
        },
        error =>{
            var errorMessage = <any>error;
            if(errorMessage != null){
              console.log(errorMessage);
            }
        });

    }else{
      //Se crea un ticket con un solicitante ya existente
      if(this.requester){
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
                        if(!this.filesToUpload){
                        }else{
                            this._uploadService.makeFileRequest(this.url+'textblock/file/'+response.textblock._id, [], this.filesToUpload, this.token, 'file')
                            .then(
                                result =>{
                                }, 
                                error =>{
                                    console.log('Error');
                                }
                            );
                        }
                        this._router.navigate(['/ticket-gestion',response.textblock.ticket]);       
                      }
                    },
                    error =>{
                        console.log(error);
                    }
                  );
              }
          },
          error =>{
              console.log(error);
          }
        );
      }else{
        alert('Selecciona un solicitante')
      }
    }
  }



  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}
