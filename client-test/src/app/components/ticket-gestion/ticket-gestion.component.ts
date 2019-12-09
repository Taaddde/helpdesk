import { Component, OnInit } from '@angular/core';
import { userService } from '../../services/user.service';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { ticketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket';
import { teamService } from '../../services/team.service';
import { Team } from '../../models/team';
import { textblockService } from '../../services/textblock.service';
import { TextBlock } from '../../models/textblock';
import { uploadService } from '../../services/upload.service';
import { responseService } from '../../services/response.service';
import { Response } from '../../models/response';

import * as moment from 'moment';
import { companyService } from '../../services/company.service';
import { Company } from '../../models/company';
import { User } from '../../models/user';

declare var $: any;


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
  public ccList: User[];
  public allCcList: User[];
  public ccFilter: string;
  public chat: TextBlock[];
  public companies: Company[];
  public identity;
  public token;
  public url: string;
  public agents: User[];
  public teams: Team[];
  public editSub: boolean;
  public subMod:string;
  public isPrivate: boolean;
  public isCc: boolean;
  public space: string;

  public keyPress: boolean;

  public stat: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _ticketService: ticketService,
    private _teamService: teamService,
    private _textblockService: textblockService,
    private _uploadService: uploadService,
    private _responseService: responseService,
    private _companyService: companyService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

    this.editSub = false;
    this.subMod = '';
    this.isPrivate = false;
    this.space = ' ';

    this.keyPress = false;

    this.ccList = [];
    this.allCcList = [];
    this.ccFilter = '';
    this.isCc = false;

    this.stat = '';


    this.ticket = new Ticket('','',null,'','','','','','','',null,'',[''],'','','',[''],null,null,'');
    this.textblock = new TextBlock('','',this.identity['_id'],'','','',[''],false)
  }

  ngOnInit() {
    this.getTicket();
    this.getHashtags(); 
    this.getCompanies();
  }

  getCc(){
    this._userService.getListReq(this.token, this.ticket.company['_id']).subscribe(
      response =>{
          if(!response.users){
            this._router.navigate(['/']);
          }else{
            this.allCcList = response.users;
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


  filterCc(){
    if(this.ccFilter.length >= 3){
      this.keyPress = true;
    } else{
      this.keyPress = false;
    }

    this.ccList = this.allCcList.filter(cc =>{
      return (cc['name']+cc['surname']).toLowerCase().includes(this.ccFilter.toString().toLowerCase());
    })
  }

  setCc(val: User){
    this._ticketService.addCc(this.token, this.ticket._id, val._id).subscribe(
      response =>{
          if(!response.ticket){
            this._router.navigate(['/']);
          }else{
            this.newInfo(this.identity['name']+' '+this.identity['surname']+' puso en copia a '+val.name+' '+val.surname+' en este ticket')
            this.getTicket();
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


  deleteCc(val: User){
    this._ticketService.removecc(this.token, this.ticket._id, val._id).subscribe(
      response =>{
          if(!response.ticket){
            this._router.navigate(['/']);
          }else{
            this.newInfo(this.identity['name']+' '+this.identity['surname']+' elminó a '+val.name+' '+val.surname+' de los usuarios en copia')
            this.getTicket();
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

  getLenght(val: Array<any>){
    return val.length;
  }

  getTeams(company: any){
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
          console.error(error);
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
          console.error(error);
      }
    );
  }

  getReqTickets(req:any){
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
            console.error(error);
            }
        }
      );
    }
  }

  getChat(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];
      this._textblockService.getForTicket(this.token, id, this.identity['role']).subscribe(
        response =>{

            if(response.textblocks){

              this.chat = response.textblocks;

              if(this.identity['role'] != 'ROLE_REQUESTER'){
                if(this.ticket.agent){
                  if(this.identity['_id'] == this.ticket.agent['_id']){
                    this._textblockService.readAgent(this.token, this.ticket._id).subscribe(
                      response =>{
                          if(!response.textblock){
                            console.error('Error en textblock')
                          }
                      },
                      error =>{
                          console.error(error);
                      }
                    );
                  }
                }
              }else{
                if(this.identity['_id'] == this.ticket.requester['_id']){
                  this._textblockService.readRequester(this.token, this.ticket._id).subscribe(
                    response =>{
                        if(!response.textblock){
                          console.error('Error en textblock')
                        }else{
                        }
                    },
                    error =>{
                        console.error(error);
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
                          }
                      },
                      error =>{
                          console.error(error);
                      }
                    );
                  }else{
                    if(this.identity['role'] == 'ROLE_REQUESTER' && this.identity['_id'] == this.ticket.requester['_id']){
                      this._textblockService.readRequester(this.token, this.ticket._id).subscribe(
                        response =>{
                            if(!response.textblock){
                              console.log('Error en textblock')
                            }
                        },
                        error =>{
                            console.error(error);
                        }
                      );
  
                    }
                  }  
                }
              }      
            }
        },
        error =>{
            console.error(error);
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
          console.error(error);
      }
    );
  }

  getTicket(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];

      this._ticketService.getOne(this.token, id).subscribe(
        response => {
          this.ticket = response.ticket;
          this.getChat();
          this.getTeams(response.ticket.company['_id']);
          if(response.ticket.team){
            this.agents = response.ticket.team.users;
          }
          this.getReqTickets(response.ticket.requester);

          if(this.ticket.cc){
            let cc = this.ticket.cc.map(function(user) {
              return user['_id'];
            });
  
            if(cc.indexOf(this.identity['_id']) != -1){
              this.isCc = true;
            }
    
          }
      },
        error => {
          var errorMessage = <any>error;
          if(errorMessage != null){
          var body = JSON.parse(error._body);
          //this.alertMessage = body.message;
          console.error(error);
          }
        }
      )
    })
      
  }

  selectHashtag(val:string){
    this.textblock.text = this.textblock.text + val;
    document.getElementById('editable').innerHTML = document.getElementById('editable').innerHTML + val;
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

      this.ticket.team = val;
      this.ticket.agent = null;
      this.editTicket();
      this.newInfo(this.identity['name']+' '+this.identity['surname']+' asignó a '+name+' como equipo de esta solicitud');

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

  subToEdit(val:string){
    if(this.identity['company']){
      if(this.identity['company']['_id'] == this.ticket.company['_id']){
        this.editSub = true; 
        this.subMod = val  
      }
    }else{
      if(this.identity['_id'] == this.ticket.requester['_id']){
        this.editSub = true; 
        this.subMod = val  
      }
    }
  }

  editTicketSub(){
    this.newInfo(this.identity['name']+' '+this.identity['surname']+' ha cambiado el asunto de la solicitud de '+this.ticket.sub+' a '+this.subMod)
    this.ticket.sub = this.subMod;
    this.editTicket();
    this.editSub = false;
  }

  checkWorkTime(val:string){
    console.log(this.ticket)
    if(this.ticket.workTime){
      this.stat = val;
      $("#timework").modal("show");
    }else{
      this.setStatus(val);
    }
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
      $("#timework").modal("hide"); 
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
          console.error(error);
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
          console.error(error);
        }
      }
    );

  }

  onSubmit(){

    if(this.textblock.text != ''){
      this.textblock.text = this.textblock.text.split('<span')[0];
    }

    console.log(this.textblock.text)

    if(this.textblock.text != ''){
      console.log(this.textblock.text);
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
              if(this.filesToUpload){
                  this._uploadService.makeFileRequest(this.url+'textblock/file/'+response.textblock._id, [], this.filesToUpload, this.token, 'file');
              }
            }
  
            let nameTo:string;
            let mailTo:string;
  
            if(this.ticket.company['mailSender'] == true){
              if(this.identity['role'] != 'REQUESTER'){
                if(this.ticket.requester['receiveMail'] == true){
                  nameTo = this.ticket.requester['name']+' '+this.ticket.requester['surname'];
                  mailTo = this.ticket.requester['email'];  
                }
              }else{
                if(this.ticket.agent['receiveMail'] == true){
                  nameTo = this.ticket.agent['name']+' '+this.ticket.agent['surname'];
                  mailTo = this.ticket.agent['email'];
                }
              }
    
              if(nameTo){
                let link:string = window.location.href;
                let nameFrom:string = this.identity['name']+' '+this.identity['surname'];
                let cc = this.ticket.cc.map(function(user) {
                  return user['email'];
                });
                
                this._ticketService.sendMail(this.token, nameFrom, this.ticket, response.textblock.text, nameTo, mailTo, link, cc).subscribe(
                  response =>{
                  },
                  error =>{
                      console.error(error);
                  }
                );
              }
    
            }
  
            
            this.editTicket()
            this.pushText(response.textblock._id) ;
            this.textblock = new TextBlock('','',this.identity['_id'],'','','',[''],false);
            document.getElementById('editable').innerHTML = ''
            this.filesToUpload = new Array<File>();
        },
        error =>{
          var errorMessage = <any>error;
          if(errorMessage != null){
            var body = JSON.parse(error._body);
            console.error(error);
          }
        }
      );
    }else{
      alert('Escribe un mensaje antes de enviarlo')
    }

    
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
          console.error(error);
          }
      }
    );
  }

  changeDate(val:string){
    return moment(val, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm');
  }

  outOfLimit(){
    if(this.ticket.realWorkTime*100/this.ticket.workTime >= 150){
      return true;
    }else{
      return false;
    }
  }

  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }



}
