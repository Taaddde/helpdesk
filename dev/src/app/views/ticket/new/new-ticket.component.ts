import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from 'app/shared/models/helpdesk/user';
import { ticketService } from 'app/shared/services/helpdesk/ticket.service';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { teamService } from 'app/shared/services/helpdesk/team.service';
import { Team } from 'app/shared/models/helpdesk/team';
import { Ticket } from 'app/shared/models/helpdesk/ticket';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { TextBlock } from 'app/shared/models/helpdesk/textblock';
import { textblockService } from 'app/shared/services/helpdesk/textblock.service';
import { uploadService } from 'app/shared/services/helpdesk/upload.service';
import { Router } from '@angular/router';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { typeTicketService } from 'app/shared/services/helpdesk/typeticket.service';
import { subTypeTicketService } from 'app/shared/services/helpdesk/subtypeticket.service';
import { TypeTicket } from 'app/shared/models/helpdesk/typeticket';
import { SubTypeTicket } from 'app/shared/models/helpdesk/subtypeticket';
import { Company } from 'app/shared/models/helpdesk/company';
import { companyService } from 'app/shared/services/helpdesk/company.service';
import * as moment from "moment"

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrls: ['./new-ticket.component.css'],
  providers: [teamService, textblockService, uploadService, typeTicketService, subTypeTicketService, companyService]
})
export class NewTicketComponent implements OnInit {
  public token: string;
  public identity;
  public url: string = GLOBAL.url;
  public config = GLOBAL.richTextModule;

  public ticket: Ticket;
  public text: TextBlock;
  public requester: User;
  public subType: SubTypeTicket;

  public requesters: User[];
  public agents: User[];
  public tempRequesters: User[];
  public tempAgents: User[];

  public companies: Company[];
  public teams: Team[];
  public types: TypeTicket[];
  public subTypes: SubTypeTicket[];

  public requesterControl: FormGroup;
  public descriptionControl: FormGroup;
  public respControl: FormGroup;
  public typeControl: FormGroup;

  public ccList: User[] = [];
  public allCcList: User[] = [];
  public ccFilter: string = '';

  public cc: Array<User>;


  constructor(
    private _ticketService: ticketService,
    private _userService: userService,
    private _textBlockService: textblockService,
    private _uploadService: uploadService,
    private snackBar: MatSnackBar,
    private _teamService: teamService,
    private _companyService: companyService,
    private _router: Router,
    private loader: AppLoaderService,
    private _typeTicketService: typeTicketService,
    private _subTypeTicketService: subTypeTicketService,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();

    this.cc = new Array<User>();
  }

  ngOnInit() {
    if(this.identity['role'] == 'ROLE_REQUESTER'){
      this.getCompany();
      this.getCc();
    }else{
      this.getTeams();
      this.getRequesters();  
    }
    this.buildForm();
  }

  buildForm(){
    this.requesterControl = new FormGroup({
      requester: new FormControl(null, [Validators.required]),
    });

    this.descriptionControl = new FormGroup({
      sub: new FormControl(null, [Validators.required]),
      text: new FormControl(null, [Validators.required]),
      important: new FormControl(false),
      files: new FormControl(undefined)
    });

    this.respControl = new FormGroup({
      team: new FormControl(null, [Validators.required]),
      agent: new FormControl(null, [Validators.required]),
    });

    this.typeControl = new FormGroup({
      company: new FormControl(null, [Validators.required]),
      subtype: new FormControl(null, [Validators.required]),
      resolve: new FormControl(null),
    });
  }

  getRequesters(){
    this._userService.getListReq(this.token, this.identity['company']['_id']).subscribe(
        response =>{
          if(response.users){
            this.requesters = response.users;
            this.tempRequesters = response.users;
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
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

  getTypes(company: string){
    this._typeTicketService.getList(this.token, company).subscribe(
        response =>{
          if(response.typeTickets){
             this.types = response.typeTickets;
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }

  getSubTypes(type: string){
    this._subTypeTicketService.getList(this.token, type).subscribe(
        response =>{
          if(response.subTypeTickets){
             this.subTypes = response.subTypeTickets;
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }

  getCompany(){
    this._companyService.getList(this.token).subscribe(
        response =>{
          if(response.companies){
             this.companies = response.companies;
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
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

  setTeam(team: Team){
    this.respControl.controls['team'].setValue(team._id);
    this.getAgents(team.users);
  }

  setCompany(company: Company){
    this.typeControl.controls['company'].setValue(company._id);
    this.typeControl.controls['subtype'].setValue(null);
    this.subTypes = null;
    this.getTypes(company._id);
  }

  setType(type: TypeTicket){
    this.getSubTypes(type._id);
  }

  setSubType(subtype: SubTypeTicket){
    this.subType = subtype;
    this.typeControl.controls['subtype'].setValue(subtype._id);

    this.descriptionControl.controls['sub'].setValue(null);
    this.descriptionControl.controls['text'].setValue(null);
    if(subtype.autoSub && subtype.autoSub != ''){
      this.descriptionControl.controls['sub'].setValue(subtype.autoSub);
    }
    if(subtype.autoDesc && subtype.autoDesc != ''){
      this.descriptionControl.controls['text'].setValue(subtype.autoDesc);
    }

    this.respControl.controls['team'].setValue(null);
    if(subtype.team){
      this.respControl.controls['team'].setValue(subtype.team['_id']);
    }
    this.setResolve(subtype);
  }

  getAgents(users){
    this.agents = users;
    this.tempAgents = users;
  }

  setAgent(user: User){
    this.respControl.controls['agent'].setValue(user._id);
  }

  setRequester(user: User){
    this.requesterControl.controls['requester'].setValue(user._id);
    this.requester = user;
  }

  setResolve(subtype: SubTypeTicket){
    let day = moment().add(subtype.resolveDays, "days").format("DD-MM-YYYY");
    // 0 = DOM
    // 6 = SAB
    if(moment(day, "DD-MM-YYYY").weekday() == 6 || moment(day, "DD-MM-YYYY").weekday() == 0){ 
        day = moment(day, "DD-MM-YYYY").add(2, "days").format("DD-MM-YYYY");
    }
    this.typeControl.controls['resolve'].setValue(day);
  }

  filterRequester(val){
    this.requesters = this.tempRequesters.filter(req =>{
      return (req['name']+req['surname']).toLowerCase().includes(val.toString().toLowerCase());
    })
  }

  resetFiles(){
    this.descriptionControl.controls['files'].setValue(undefined);
    this.openSnackBar('Adjuntos eliminados', 'Cerrar');
  }

  getLenght(arr: any): number{
    return arr.length;
  }
  
  submit() {
    this.loader.open('Generando ticket');
    if(this.identity['role'] != 'ROLE_REQUESTER'){
      this.ticket = new Ticket('','',null,null,null,null,'Abierto','','',null,null,'MANUAL',[null],'Normal',this.identity['company']['_id'],null,new Array(),null,null,'');
      this.ticket.requester = this.requesterControl.controls['requester'].value;
      if(this.descriptionControl.controls['important'].value)
        this.ticket.priority = 'Urgente';
      if(this.respControl.controls['agent'].value)
        this.ticket.agent = this.respControl.controls['agent'].value;
      this.ticket.source = 'MANUAL';
    }else{
      this.ticket = new Ticket('','',null,this.identity['_id'],null,null,'Abierto','','',null,null,'MANUAL',[null],'Normal',null,null,new Array(),null,null,'');
      this.ticket.company = this.typeControl.controls['company'].value;
      this.ticket.subTypeTicket = this.typeControl.controls['subtype'].value;
      this.ticket.source = 'PORTAL';
      this.ticket.resolveDate = this.typeControl.controls['resolve'].value;

      if(this.cc.length != 0){
        let list = new Array<string>();

        this.cc.forEach(user => {
          list.push(user._id);
        });

        this.ticket.cc = list;
      }
    }

    this.ticket.sub = this.descriptionControl.controls['sub'].value;
    if(this.respControl.controls['team'].value){
      this.ticket.team = this.respControl.controls['team'].value;
      this.ticket.status = 'Pendiente';
    }


    this._ticketService.add(this.token, this.ticket).subscribe(
        response =>{
          if(response.ticket){
             let t = response.ticket;
             this.text = new TextBlock('',this.descriptionControl.controls['text'].value,this.identity['_id'],'',t._id,'PUBLIC',[null],false);
              if(this.identity['role'] == 'ROLE_REQUESTER')
                this.text.type = 'REQUEST';
             this._textBlockService.add(this.token, this.text).subscribe(
                 response =>{
                   if(response.textblock){
                     if(this.descriptionControl.controls['files'].value != undefined && this.descriptionControl.controls['files'].value != null){
                       let fileToUpload = this.descriptionControl.controls['files'].value.files;
                      this._uploadService.makeFileRequest(this.url+'textblock/file/'+response.textblock._id, [], fileToUpload, this.token, 'file')
                      .then(
                          result =>{
                            this.loader.close()
                          }, 
                          error =>{
                            this.openSnackBar(error.message, 'Cerrar');
                          }
                      );
                     }else{
                      this.loader.close()
                     }
                      
                     this.openSnackBar('Ticket generado correctamente', 'Cerrar')
                      this._router.navigate(['/ticket/gestion',response.textblock.ticket]);    
                   }
                 },
                 error =>{
                  this.loader.close()
                  this.openSnackBar(error.message, 'Cerrar');
                 }
             );
          }
        },
        error =>{
          this.loader.close()
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }

  isInvalid(){
    if(this.descriptionControl.invalid){
      return true;
    }else{
      if(this.identity['role'] != 'ROLE_REQUESTER'){
        return false;
      }else{
        if(this.subType.autoChange == false || this.subType.autoChange == undefined){
          return false;
        }else{
          if(this.descriptionControl.controls['text'].value == this.subType.autoDesc && this.descriptionControl.controls['sub'].value == this.subType.autoSub){
            return true;
          }else{
            return false;
          }
        }
      }
    }
  }


  public fileChangeEvent(fileInput:any){
    this.descriptionControl.controls['files'].setValue(<Array<File>>fileInput.target.files);
    this.openSnackBar('Adjuntos añadidos', 'Cerrar');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  filterCc(){
    this.ccList = this.allCcList.filter(cc =>{
      return (cc['name']+cc['surname']).toLowerCase().includes(this.ccFilter.toString().toLowerCase());
    })
  }

  setCc(val: User){
    if(this.cc.indexOf(val) == -1){
      this.cc.push(val)
    }
  }

  public deleteCc(val: User){
    if(this.cc.indexOf(val) != -1){
      this.cc.splice(this.cc.indexOf(val), 1);
    }
  }
}
