import { Component, OnInit, AfterViewInit } from '@angular/core';

import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global';
import { userService } from '../../services/user.service';
import 'rxjs/add/observable/interval';
import { companyService } from '../../services/company.service';
import { typeTicketService } from '../../services/typeticket.service';
import { subTypeTicketService } from '../../services/subtypeticket.service';
import { Company } from '../../models/company';
import { TypeTicket } from '../../models/typeticket';
import { SubTypeTicket } from '../../models/subtypeticket';
import { ticketService } from 'app/services/ticket.service';
import { textblockService } from 'app/services/textblock.service';
import { Ticket } from 'app/models/ticket';
import { TextBlock } from 'app/models/textblock';
import { uploadService } from 'app/services/upload.service';
import * as moment from "moment"


declare var $: any;

@Component({
  selector: 'app-ticket-portal',
  templateUrl: './ticket-portal.component.html',
  styleUrls: ['./ticket-portal.component.scss'],
  providers:[userService, uploadService, ticketService, textblockService, companyService, typeTicketService, subTypeTicketService]
})
export class TicketPortalComponent implements OnInit {
  public identity;
  public token;
  public url: string;

  public companies: Company[];
  public types: TypeTicket[];
  public subtypes: SubTypeTicket[];

  public allCompanies: Company[];
  public allTypes: TypeTicket[];
  public allSubtypes: SubTypeTicket[];

  public companyName: string;
  public typeName: string;
  public subTypeName: string;

  public companyFilter:string;
  public typeFilter:string;
  public subTypeFilter:string;

  public ticket:Ticket;
  public tb: TextBlock;

  public selectedSubtype: SubTypeTicket;
  public allChecked: boolean
  

  //Asigna un valor a una propiedad
  constructor(
    private _userService: userService,
    private _companyService: companyService,
    private _typeTicketService: typeTicketService,
    private _subTypeTicketService: subTypeTicketService,
    private _ticketService: ticketService,
    private _textblockService: textblockService,
    private _uploadService: uploadService,

    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.url=GLOBAL.url;
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();

    this.companyName = 'Sector';
    this.typeName = 'Tipo';
    this.subTypeName = 'Sub-tipo';
    this.companyFilter = '';
    this.typeFilter = '';
    this.subTypeFilter = '';

    this.selectedSubtype = new SubTypeTicket('','','',null,'',[null],null,false,'');
    this.ticket = new Ticket('','',null,this.identity['_id'],null,null,'Abierto','','','',null,'PORTAL',[null],'Normal','','');
    this.tb = new TextBlock('','',this.identity['_id'],'','','REQUEST',[''],false);

    this.allChecked = false;
  
  } 

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.getCompanies();
  }

  getCompanies(){
    this._companyService.getList(this.token).subscribe(
      response =>{
          if(!response.companies){
              alert('Error en el servidor');
          }else{
            this.companies = response.companies;
            this.allCompanies = response.companies;
          }
      },
      error =>{
          console.log(error);
      }
    );
  }

  getTypes(companyId:string){
    this._typeTicketService.getList(this.token,companyId).subscribe(
      response =>{
          if(!response.typeTickets){
              alert('Error en el servidor');
          }else{
            this.types = response.typeTickets;
            this.allTypes = response.typeTickets;
          }
      },
      error =>{
          console.log(error);
      }
    );
  }

  getSubtypes(typeId:string){
    this._subTypeTicketService.getList(this.token,typeId).subscribe(
      response =>{
          if(!response.subTypeTickets){
              alert('Error en el servidor');
          }else{
            this.subtypes = response.subTypeTickets;
            this.allSubtypes = response.subTypeTickets;
          }
      },
      error =>{
          console.log(error);
      }
    );
  }

  filterCompany(){
    this.companies = this.allCompanies.filter(company =>{
      return (company['name']).toLowerCase().includes(this.companyFilter.toString().toLowerCase());
    })
  }

  filterType(){
    this.types = this.allTypes.filter(type =>{
      return (type['name']).toLowerCase().includes(this.typeFilter.toString().toLowerCase());
    })
  }

  filterSubType(){
    this.subtypes = this.allSubtypes.filter(subtype =>{
      return (subtype['name']).toLowerCase().includes(this.subTypeFilter.toString().toLowerCase());
    })
  }

  clickCompany(val:Company){
    this.getTypes(val._id);
    this.ticket.company = val._id;
    this.companyName = val.name;
    this.companyFilter = '';
    this.typeName = 'Tipo';
    this.subTypeName = 'Subtipo';
    this.selectedSubtype = new SubTypeTicket('','','',null,'',[null],null,false,'');

  }

  clickType(val:TypeTicket){
    this.typeFilter = '';
    this.getSubtypes(val._id);
    this.typeName = val.name;
    this.subTypeName = 'Subtipo';
    this.selectedSubtype = new SubTypeTicket('','','',null,'',[null],null,false,'');

  }

  clickSubtype(val:SubTypeTicket){
    this.subTypeFilter = '';
    this.ticket.team = this.selectedSubtype.team['_id'];
    this.ticket.subTypeTicket = this.selectedSubtype._id;
    
    let day = moment().add(this.selectedSubtype.resolveDays, "days").format("DD-MM-YYYY");
    // 0 = DOM
    // 6 = SAB
    if(moment(day, "DD-MM-YYYY").weekday() == 6 || moment(day, "DD-MM-YYYY").weekday() == 0){ 
        day = moment(day, "DD-MM-YYYY").add(2, "days").format("DD-MM-YYYY");
    }
    this.ticket.resolveDate = day;
    this.subTypeName = val.name;
    this.selectedSubtype = val;
  }

  getLenght(val: Array<String>){
    return val.length;
  }

  checkValidates(){
    if($('.checkvalidate:checked').length == $('.checkvalidate').length){
      this.allChecked = true;
    }else{
      this.allChecked = false;
    }
  }

  cancelTicket(){
    this.companyName = 'Sector'
    this.typeName = 'Tipo';
    this.subTypeName = 'Sub-tipo';
    this.companyFilter = '';
    this.typeFilter = '';
    this.subTypeFilter = '';

    this.selectedSubtype = new SubTypeTicket('','','',null,'',[null],null,false,'');
    this.ticket = new Ticket('','',null,this.identity['_id'],null,null,'Abierto','','','',null,'PORTAL',[null],'Normal','','');
    this.tb = new TextBlock('','',this.identity['_id'],'','','REQUEST',[''],false);

    this.allChecked = false;


    $("#newticket").modal("hide");
  }

  onSubmit(){
    console.log(this.tb.text)
    if(this.selectedSubtype.requireAttach && this.filesToUpload == undefined){
      alert('La solicitud requiere de un adjunto obligatorio')
    }else{
      delete this.ticket.agent;
      delete this.ticket.createDate;
      delete this.ticket.lastActivity;
      delete this.ticket.rating;
      delete this.ticket.tags;
      delete this.ticket.numTicket;
      if(!this.ticket.team){
        delete this.ticket.team;
      }

      this.ticket.subTypeTicket = this.selectedSubtype._id;

      delete this.tb.createDate;

      var link;
      this._ticketService.add(this.token, this.ticket).subscribe(
        response =>{
            if(!response.ticket){
              alert('Generación de ticket: error en el servidor');
            }else{
              this.tb.ticket = response.ticket._id;
              link = response.ticket._id;
              console.log(this.tb.text)
              this._textblockService.add(this.token, this.tb).subscribe(
                response =>{
                    if(!response.textblock){
                      alert('Generación de chat: error en el servidor');
                    }else{
                      if(this.filesToUpload){
                        this._uploadService.makeFileRequest(this.url+'textblock/file/'+response.textblock._id, [], this.filesToUpload, this.token, 'file')
                      }
                      alert('Ticket creado')
                      this.cancelTicket();
                      this._router.navigate(['/ticket-gestion',link]);
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
  }

  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }


}
