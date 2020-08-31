import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import * as moment from 'moment';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { ticketService } from 'app/shared/services/helpdesk/ticket.service';
import { Ticket } from 'app/shared/models/helpdesk/ticket';
import { User } from 'app/shared/models/helpdesk/user';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { TextBlock } from 'app/shared/models/helpdesk/textblock';
import { Company } from 'app/shared/models/helpdesk/company';
import { Team } from 'app/shared/models/helpdesk/team';
import { teamService } from 'app/shared/services/helpdesk/team.service';
import { textblockService } from 'app/shared/services/helpdesk/textblock.service';
import { uploadService } from 'app/shared/services/helpdesk/upload.service';
import { responseService } from 'app/shared/services/helpdesk/response.service';
import { companyService } from 'app/shared/services/helpdesk/company.service';
import { FormControl } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-ticket-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css',],
  providers: [userService, ticketService, teamService, textblockService, uploadService, responseService, companyService]
})
export class TicketGestionComponent implements OnInit {

    public ticket: Ticket;
    public reqTickets: [Ticket];
    public textblock: TextBlock;
    public responses: Response[];
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


    public lock: boolean;

    public ccList: User[];
    public allCcList: User[];
    public ccFilter: string;

    public next: Ticket;
    public prev: Ticket;

    public stat: string;

    public emojis: boolean;

    public config: any;

    public info: string;

  constructor(
    private dialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private snackBar: MatSnackBar,
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

    this.ccList = [];
    this.allCcList = [];
    this.ccFilter = '';
    this.isCc = false;

    this.stat = '';

    this.info = 'true';

    this.ticket = new Ticket('','',null,'','','','','','','',null,'',[''],'','','',[''],null,null,'');
    this.textblock = new TextBlock('','',this.identity['_id'],'','','',[''],false);

    this.emojis = false;

    this.config = GLOBAL.richTextModule;
  }

  ngOnInit() {
    this.getTicket();
    this.getHashtags(); 
    this.getCompanies();
    this.checkInfo();
    this.getCc();
  }

  checkInfo(){
    if(this.identity['infoView'] != false){
      this.info = 'true';
    }else{
      this.info = 'false';
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  getCc(){
    this._userService.getList(this.token).subscribe(
      response =>{
          if(response.users){
            this.allCcList = response.users;
          }
      },
      error =>{
          this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  changeInfo(){
    if(this.info == 'false'){
      this.info = 'true';
    }else{
      this.info = 'false';
    }
    this.getChat();
  }

  getPrevNext(num, status){
    this._ticketService.getPrevNext(this.token, this.identity['_id'], num, status, this.identity['role']).subscribe(
      response =>{
          this.next = response.nextTicket;
          this.prev = response.prevTicket;
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  filterCc(){
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
        this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  deleteCc(val: User){
    this._ticketService.removecc(this.token, this.ticket._id, val._id).subscribe(
      response =>{
          if(response.ticket){
            this.newInfo(this.identity['name']+' '+this.identity['surname']+' elminó a '+val.name+' '+val.surname+' de los usuarios en copia')
            this.getTicket();
          }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  getLenght(val: Array<any>){
    return val.length;
  }

  deleteMessage(){
    this.openSnackBar('El mensaje fue eliminado correctamente.', 'Cerrar');
  }

  errorMessage(){
    this.openSnackBar('No puede eliminar un mensaje con más de dos horas de realizado', 'Cerrar');
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
        this.openSnackBar(error.message, 'Cerrar');
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
        this.openSnackBar(error.message, 'Cerrar');
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
          this.openSnackBar(error.message, 'Cerrar');
        }
      );
    }
  }

  cleanAttach(){
    this.filesToUpload = undefined;
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
                        this.openSnackBar(error.message, 'Cerrar');
                      }
                    );
                  }
                }
              }else{
                if(this.identity['_id'] == this.ticket.requester['_id']){
                  this._textblockService.readRequester(this.token, this.ticket._id).subscribe(
                    response =>{
                    },
                    error =>{
                      this.openSnackBar(error.message, 'Cerrar');
                    }
                  );
                }
              }

              if(this.ticket.agent){
                if(this.ticket.agent['_id']){
                  if(this.identity['role'] != 'ROLE_REQUESTER' && this.identity['_id'] == this.ticket.agent['_id']){
                    this._textblockService.readAgent(this.token, this.ticket._id).subscribe(
                      response =>{
                      },
                      error =>{
                        this.openSnackBar(error.message, 'Cerrar');
                      }
                    );
                  }else{
                    if(this.identity['role'] == 'ROLE_REQUESTER' && this.identity['_id'] == this.ticket.requester['_id']){
                      this._textblockService.readRequester(this.token, this.ticket._id).subscribe(
                        response =>{
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
          this.openSnackBar(error.message, 'Cerrar');
        }
      );
    });
  }

  getHashtags(){
    this._responseService.getList(this.token, this.identity['_id']).subscribe(
      response =>{
          if(response.responses){
            this.responses = response.responses;
          }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  getTicket(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];

      this._ticketService.getOne(this.token, id).subscribe(
        response => {
          this.ticket = response.ticket;
          console.log(this.ticket)
          this.getChat();
          this.getPrevNext(response.ticket['numTicket'], response.ticket['status']);
          this.getTeams(response.ticket.company['_id']);
          if(response.ticket.team){
            this.agents = response.ticket.team.users;
          }

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
          this.openSnackBar(error.message, 'Cerrar');
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
      if(this.identity['_id'] == val){
        this.newInfo(this.identity['name']+' '+this.identity['surname']+' se asignó como agente de esta solicitud')
      }else{
        this.newInfo(this.identity['name']+' '+this.identity['surname']+' asignó a '+name+' '+surname+' como agente de esta solicitud')
      }
    }else{
      this.ticket.agent = val;
      this.editTicket();
      if(this.identity['_id'] == val){
        this.newInfo(this.identity['name']+' '+this.identity['surname']+' se asignó como agente de esta solicitud')
      }else{
        this.newInfo(this.identity['name']+' '+this.identity['surname']+' asignó a '+name+' '+surname+' como agente de esta solicitud')
      }
    }
  }

  selectTeam(val: string, name:string){

      this.ticket.team = val;
      this.ticket.agent = null;
      this.ticket.status = 'Pendiente';
      this.editTicket();
      this.newInfo(this.identity['name']+' '+this.identity['surname']+' asignó a '+name+' como equipo de esta solicitud');
      this.newInfo(this.identity['name']+' '+this.identity['surname']+' ha cambiado el estado de la solicitud a pendiente');

  }

  cancelFinish(){
    let text = this.textblock.text;
    if(text != ''){
      text = text.split('<span _ngco')[0];
    }

    if(text != ''){
      this.newInfo(this.identity['name']+' '+this.identity['surname']+' ha reabierto el ticket');
      this.onSubmit();
      this.ticket.status = 'Pendiente'
      this.editTicket();
    }else{
      this.openSnackBar('Escribe un mensaje antes de enviarlo', 'Cerrar');
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
      this.openSnackBar('No puede seleccionar una fecha anterior a la actual', 'Cerrar');
      this.ticket.resolveDate = '';
    }
  }

  calculateClasses(){
    var tmp = {};
    switch(this.ticket.status){
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
    tmp['btn'] = true;
    tmp['btn-dark'] = true;
    tmp['dropdown-toggle'] = true;
    return tmp;
  }

  subToEdit(val:string){
    if(this.ticket.status != 'Cerrado'){
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
  }

  editTicketSub(){
    this.newInfo(this.identity['name']+' '+this.identity['surname']+' ha cambiado el asunto de la solicitud de '+this.ticket.sub+' a '+this.subMod.toUpperCase())
    this.ticket.sub = this.subMod;
    this.editTicket();
    this.editSub = false;
  }

  checkWorkTime(val:string){
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
      this.openSnackBar('Debe seleccionar un responsable para cambiar el ticket a ese estado', 'Cerrar');
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
        this.openSnackBar(error.message, 'Cerrar');
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
          if(response.textblock){
            this.pushText(response.textblock._id);
          }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    );

  }

  onSubmit(){
    if(this.textblock.text != ''){
      this.textblock.text = this.textblock.text.split('<span _ngco')[0];
    }

    if(this.textblock.text != ''){
      if(this.identity['role'] == 'ROLE_REQUESTER'){
        this.textblock.type = 'REQUEST';
        delete this.ticket.agent;
        delete this.ticket.team;
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

            if(this.textblock.type != 'PRIVATE' && this.ticket.company['mailSender'] == true){
              if(this.identity['role'] != 'ROLE_REQUESTER'){
                //Esta mandando el mensaje un agente
                if(this.ticket.requester['receiveMail'] == true){
                  nameTo = this.ticket.requester['name']+' '+this.ticket.requester['surname'];
                  mailTo = this.ticket.requester['email'];  
                }
              }else{
                //Esta mandando el mensaje un solicitante
                if(this.ticket.agent && this.ticket.agent['receiveMail'] == true){
                  nameTo = this.ticket.agent['name']+' '+this.ticket.agent['surname'];
                  mailTo = this.ticket.agent['email'];
                }
              }

              if(nameTo){
                let link:string = window.location.href;
                let nameFrom:string = this.identity['name']+' '+this.identity['surname'];
                let cc = undefined;

                if(this.ticket.cc){
                  cc = this.ticket.cc.map(function(user) {
                    return user['email'];
                  });
                    
                }

                this._ticketService.sendMail(this.token, nameFrom, this.ticket, response.textblock.text, nameTo, mailTo, link, cc).subscribe(
                  response =>{
                  },
                  error =>{
                    this.openSnackBar(error.message, 'Cerrar');
                  }
                );
              }
    
            }
  
            
            this.editTicket()
            this.pushText(response.textblock._id) ;
            this.textblock = new TextBlock('','',this.identity['_id'],'','','',[''],false);
            document.getElementById('editable').innerHTML = ''
            //document.getElementById('editable').innerHTML += '<span id="antieditable" contentEditable="false"></span>';
            this.filesToUpload = new Array<File>();
            this.imagesToUpload = new Array<File>();
        },
        error =>{
          this.openSnackBar(error, 'Cerrar');
        }
      );
    }else{
      this.openSnackBar('Escriba un mensaje antes de enviarlo', 'Cerrar');
    }

    
  }

  showEmojis(){
    if(this.emojis){
      this.emojis = false;
    }else{
      this.emojis = true;
    }
  }

  addEmoji(val: String){
    this.textblock.text = this.textblock.text + val;
    document.getElementById('editable').innerHTML = document.getElementById('editable').innerHTML + val;
  }

  pushText(id:string){
    this._textblockService.getOne(this.token, id).subscribe(
      response =>{
          if(!response.textblock){
          }else{
            this.chat.push(response.textblock);
          }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
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


  public imagesToUpload: Array<File> = new Array<File>();
  async pastePicture(event: ClipboardEvent) {
    if(event.clipboardData.files.length != 0){
      this.imagesToUpload = new Array<File>();

      this.imagesToUpload.push(event.clipboardData.files.item(0));
  
      await this._uploadService.makeFileRequest(this.url+'textblock/image', [], this.imagesToUpload, this.token, 'image')
      .then(data =>{
        //let antiEdit = document.getElementById('antieditable');
        //antiEdit.parentNode.removeChild(antiEdit);
        document.getElementById('editable').innerHTML += '<a target="_blank" href="'+this.url+'textblock/image/'+data['filename']+'"><img src="'+this.url+'textblock/image/'+data['filename']+'" class="img-fluid" style="width: 80%; margin: 5px" alt="Responsive image"></a>';
        //document.getElementById('editable').innerHTML += '<span id="antieditable" contentEditable="false"></span>';
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
