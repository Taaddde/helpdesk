import { Component, OnInit, AfterViewInit } from '@angular/core';
import {User} from '../../models/user';

import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global';
import { userService } from '../../services/user.service';
import { Observable } from 'rxjs/Observable';
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

    this.companyName = 'Sector'
    this.typeName = 'Tipo';
    this.subTypeName = 'Sub-tipo';
    this.companyFilter = '';
    this.typeFilter = '';
    this.subTypeFilter = '';

    this.selectedSubtype = new SubTypeTicket('','','',null,'',[null],null,false,'');
    this.ticket = new Ticket('','',null,this.identity['_id'],null,null,'','','','',null,'PORTAL',[null],'Normal','','');
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



  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }


}
