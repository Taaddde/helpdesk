import { Component, OnInit } from '@angular/core';
import { userService } from 'app/services/user.service';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { ticketService } from 'app/services/ticket.service';
import { Ticket } from 'app/models/ticket';
import { Agent } from 'http';
import { teamService } from 'app/services/team.service';
import { Team } from 'app/models/team';
import { textblockService } from 'app/services/textblock.service';
import { TextBlock } from 'app/models/textblock';
import { uploadService } from 'app/services/upload.service';
import { responseService } from 'app/services/response.service';
import { Response } from 'app/models/response';

import * as moment from 'moment';
import { companyService } from 'app/services/company.service';
import { Company } from 'app/models/company';

@Component({
  selector: 'app-ticket-gestion',
  templateUrl: './ticket-gestion.component.html',
  styleUrls: ['./ticket-gestion.component.scss'],
  providers: [userService, ticketService, teamService, textblockService, uploadService, responseService, companyService]
})
export class TicketGestionComponent implements OnInit {
  
  public ticket: Ticket;
  public reqTickets: [Ticket];
  public textblock: TextBlock;
  public responses: Response[];
  public chat: [TextBlock];
  public companies: [Company];
  public identity;
  public token;
  public url: string;
  public agents: [Agent];
  public teams: [Team];
  public editSub: boolean;
  public subMod:string;
  public isPrivate: boolean;
  public space: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _ticketService: ticketService,
    private _teamService: teamService,
    private _textblockService: textblockService,
    private _uploadService: uploadService,
    private _responseService: responseService,
    private _companyService: companyService
  ) {
    this.identity = this._userService.getIdentity();
    console.log(this.identity)
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

    this.editSub = false;
    this.subMod = '';
    this.isPrivate = false;
    this.space = ' ';

    this.ticket = new Ticket('','',null,'','','','','','','',null,'',[''],'','','');
    this.textblock = new TextBlock('','',this.identity['_id'],'','','',[''],false)
   }

  ngOnInit() {
    this.getTicket();
    this.getHashtags(); 
    this.getCompanies();
  }

  getTeams(company){
    this._teamService.getList(this.token, company).subscribe(
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

  getCompanies(){
    this._companyService.getList(this.token).subscribe(
      response =>{
          if(!response.companies){
            this._router.navigate(['/']);
          }else{
            this.companies = response.companies;
          }
      },
      error =>{
          console.log(error);
      }
    );
  }

  getReqTickets(req){
    if(req){
      this._ticketService.getForUser(this.token, req['_id']).subscribe(
        response =>{
            if(!response.tickets){
              this._router.navigate(['/']);
            }else{
              this.reqTickets = response.tickets;
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
  }

  getChat(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];
      console.log(this.identity['role'])
      this._textblockService.getForTicket(this.token, id, this.identity['role']).subscribe(
        response =>{

            if(response.textblocks){

              this.chat = response.textblocks;
              console.log(this.chat)

              if(this.identity['role'] != 'ROLE_REQUESTER'){
                if(this.ticket.agent){
                  if(this.identity['_id'] == this.ticket.agent['_id']){
                    this._textblockService.readAgent(this.token, this.ticket._id).subscribe(
                      response =>{
                          if(!response.textblock){
                            console.log('Error en textblock')
                          }else{
                            console.log(response.textblock)
                            
                          }
                      },
                      error =>{
                          console.log(error);
                      }
                    );
                  }
                }
              }else{
                if(this.identity['_id'] == this.ticket.requester['_id']){
                  this._textblockService.readRequester(this.token, this.ticket._id).subscribe(
                    response =>{
                        if(!response.textblock){
                          console.log('Error en textblock')
                        }else{
                          console.log(response.textblock)
                          
                        }
                    },
                    error =>{
                        console.log(error);
                    }
                  );
                }
              }

              if(this.ticket.agent){
                if(this.ticket.agent['_id']){
                  if(this.identity['role'] != 'ROLE_REQUESTER' && this.identity['_id'] == this.ticket.agent['_id']){
                    this._textblockService.readAgent(this.token, this.ticket._id).subscribe(
                      response =>{
                          if(!response.textblock){
                            console.log('Error en textblock')
                          }else{
                            console.log(response.textblock)
                            
                          }
                      },
                      error =>{
                          console.log(error);
                      }
                    );
                  }else{
                    console.log('ELSE')
                    if(this.identity['role'] == 'ROLE_REQUESTER' && this.identity['_id'] == this.ticket.requester['_id']){
                      this._textblockService.readRequester(this.token, this.ticket._id).subscribe(
                        response =>{
                            if(!response.textblock){
                              console.log('Error en textblock')
                            }else{
                              console.log(response.textblock)
                            }
                        },
                        error =>{
                            console.log(error);
                        }
                      );
  
                    }
                  }  
                }
              }      
            }
        },
        error =>{
            console.log(error);
        }
      );
    });
  }

  getHashtags(){
    this._responseService.getList(this.token, this.identity['_id']).subscribe(
      response =>{
          if(!response.responses){
            this._router.navigate(['/']);
          }else{
            this.responses = response.responses;
          }
      },
      error =>{
          console.log(error);
      }
    );
  }

  getTicket(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];

    this._ticketService.getOne(this.token, id).subscribe(
      response =>{
          if(!response.ticket){
            this._router.navigate(['/']);
          }else{
            this.ticket = response.ticket;
            console.log(this.ticket)
            this.getChat();
            this.getTeams(response.ticket.company._id);
            if(response.ticket.team){
              this.agents = response.ticket.team.users;
            }
            this.getReqTickets(response.ticket.requester);
            console.log(this.ticket.resolveDate)
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
    });
  }


  selectHashtag(val){
    this.textblock.text = this.textblock.text + val;
  }
  selectAgent(val: string, name:string, surname:string){
    if(this.ticket.status != 'Pendiente'){
      this.ticket.agent = val;
      this.ticket.status = 'Pendiente'
      this.editTicket();
      this.newInfo(this.identity['name']+' '+this.identity['surname']+' asignó a '+name+' '+surname+' como agente de esta solicitud')
      this.newInfo(this.identity['name']+' '+this.identity['surname']+' ha cambiado el estado de la solicitud a pendiente');
    }else{
      this.ticket.agent = val;
      this.editTicket();
      this.newInfo(this.identity['name']+' '+this.identity['surname']+' asignó a '+name+' '+surname+' como agente de esta solicitud')
    }
  }

  selectTeam(val: string, name:string){
    if(this.ticket.status != 'Pendiente'){
      this.ticket.team = val;
      this.ticket.agent = null;
      this.ticket.status = 'Pendiente';
      this.editTicket();
      this.newInfo(this.identity['name']+' '+this.identity['surname']+' asignó a '+name+' como equipo de esta solicitud');
      this.newInfo(this.identity['name']+' '+this.identity['surname']+' ha cambiado el estado de la solicitud a pendiente');
    }else{
      this.ticket.team = val;
      this.ticket.agent = null;
      this.editTicket();
      this.newInfo(this.identity['name']+' '+this.identity['surname']+' asignó a '+name+' como equipo de esta solicitud');
    }

  }

  selectCompany(val: string, name:string){
    if(this.ticket.status != 'Abierto'){
      this.ticket.company = val;
      this.ticket.team = null;
      this.ticket.agent = null;
      this.agents = null;
      this.ticket.status = 'Abierto';
      this.ticket.resolveDate = null;
      this.editTicket();
      this.getTeams(val);
      this.newInfo(this.identity['name']+' '+this.identity['surname']+' asignó a '+name+' como departamento responsable de esta solicitud');
      this.newInfo(this.identity['name']+' '+this.identity['surname']+' ha cambiado el estado de la solicitud a abierto');
    }else{
      this.ticket.company = val;
      this.ticket.team = null;
      this.agents = null;
      this.ticket.agent = null;
      this.editTicket();
      this.newInfo(this.identity['name']+' '+this.identity['surname']+' asignó a '+name+' como departamento responsable de esta solicitud');
    }

  }

  selectResolveDate(){
    if(moment(this.ticket.resolveDate).isSameOrAfter((moment().format("YYYY-MM-DD")))){
      var splitDate = this.ticket.resolveDate.split('-');
      this.ticket.resolveDate = splitDate[2]+'-'+splitDate[1]+'-'+splitDate[0];
      this.editTicket();
      this.newInfo(this.identity['name']+' '+this.identity['surname']+' ha actualizado la fecha estimada de solución a '+this.ticket.resolveDate)  
    }else{
      alert('No puede seleccionar una fecha anterior a la actual')
      this.ticket.resolveDate = '';
    }
  }

  calculateClasses(status: string){
    var tmp = null;
    switch(status){
      case 'Pendiente':
        tmp = {pending:true};
        break;
      case 'Abierto':
        tmp = {open:true};
        break;
      case 'Cerrado':
        tmp = {closer:true};
        break;
      case 'Finalizado':
        tmp = {finish:true};
        break;
      default:
        break;
    }
    return tmp;
  }

  editTicketSub(){
    this.newInfo(this.identity['name']+' '+this.identity['surname']+' ha cambiado el asunto de la solicitud de '+this.ticket.sub+' a '+this.subMod)
    this.ticket.sub = this.subMod;
    this.editTicket();
    this.editSub = false;
  }

  setStatus(val:string){
    if(
      ((val == 'Cerrado' || val == 'Finalizado') && this.ticket.team && this.ticket.agent)
      ||
      (val == 'Pendiente' && this.ticket.team)
      ||
      (val == 'Abierto')
    ){
      this.newInfo(this.identity['name']+' '+this.identity['surname']+' ha cambiado el estado de la solicitud de '+this.ticket.status+' a '+val)
      this.ticket.status = val;
      this.editTicket();  
    }else{
      alert('Debe seleccionar un responsable para cambiar el ticket a ese estado')
    }
  }

  setPriority(val:string){
    this.newInfo(this.identity['name']+' '+this.identity['surname']+' ha cambiado la prioridad de la solicitud de '+this.ticket.priority+' a '+val)
    this.ticket.priority = val;
    this.editTicket();
  }

  editTicket(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];

    this._ticketService.edit(this.token, id, this.ticket).subscribe(
      response =>{
          if(!response.ticket){
          }else{
            this.getTicket();
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
    });
  }

  newInfo(message: string){
    var textblock:TextBlock;
    textblock = new TextBlock('',message,this.identity['_id'],'','','INFO',[''],false)

    this._route.params.forEach((params: Params) =>{
      textblock.ticket = params['id'];
    });
    this._textblockService.add(this.token,textblock).subscribe(
      response =>{
          if(!response.textblock){
            console.log('Error en el chat');
          }else{
            this.pushText(response.textblock._id);
          }
      },
      error =>{
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          console.log(error);
        }
      }
    );

  }

  onSubmit(){
    console.log(this.textblock);
    if(this.identity['role'] == 'ROLE_REQUESTER'){
      this.textblock.type = 'REQUEST'
    }else{
      this.textblock.read = true;
      if(this.isPrivate){
        this.textblock.type = 'PRIVATE'
      }else{
        this.textblock.type = 'PUBLIC'
      }
    }

    this._route.params.forEach((params: Params) =>{
      this.textblock.ticket = params['id'];
    });

    this._textblockService.add(this.token,this.textblock).subscribe(
      response =>{
          if(!response.textblock){
            console.log('Error en el chat');
          }else{
              if(!this.filesToUpload){
              }else{
                  this._uploadService.makeFileRequest(this.url+'textblock/file/'+response.textblock._id, [], this.filesToUpload, this.token, 'file');
              }
          }
          this.editTicket()
          this.pushText(response.textblock._id) ;
          this.textblock = new TextBlock('','',this.identity['_id'],'','','',[''],false)
          this.filesToUpload = new Array<File>();
      },
      error =>{
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          console.log(error);
        }
      }
    );
  }

  pushText(id:string){
    this._textblockService.getOne(this.token, id).subscribe(
      response =>{
          if(!response.textblock){
          }else{
            this.chat.push(response.textblock)
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

  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }



}
