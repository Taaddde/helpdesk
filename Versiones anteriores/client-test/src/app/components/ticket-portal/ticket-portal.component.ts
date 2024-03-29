import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

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
import { ticketService } from '../../services/ticket.service';
import { textblockService } from '../../services/textblock.service';
import { Ticket } from '../../models/ticket';
import { TextBlock } from '../../models/textblock';
import { uploadService } from '../../services/upload.service';
import * as moment from "moment"
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageComponent } from '../message/message.component';


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
  public allChecked: boolean;

  public emojis: boolean;
  
  @ViewChild(MessageComponent, {static:false}) message: MessageComponent;

  //Asigna un valor a una propiedad
  constructor(
    private _userService: userService,
    private _companyService: companyService,
    private _typeTicketService: typeTicketService,
    private _subTypeTicketService: subTypeTicketService,
    private _ticketService: ticketService,
    private _textblockService: textblockService,
    private _uploadService: uploadService,
    private snackBar: MatSnackBar,
    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.url=GLOBAL.url;
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
    this.companyName = 'Departamento';
    this.typeName = 'Tipo';
    this.subTypeName = 'Sub-tipo';
    this.companyFilter = '';
    this.typeFilter = '';
    this.subTypeFilter = '';

    this.selectedSubtype = new SubTypeTicket('','','',null,'',[null],null,false,'','','',null);
    this.ticket = new Ticket('','',null,this.identity['_id'],null,null,'Abierto','','','',null,'PORTAL',[null],'Normal','','',[''],null,null,'');
    this.tb = new TextBlock('','',this.identity['_id'],'','','REQUEST',[''],false);

    this.allChecked = false;
      this.message = new MessageComponent();

    this.emojis = false;
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
          console.error(error);
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
          console.error(error);
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
          console.error(error);
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
    this.selectedSubtype = new SubTypeTicket('','','',null,'',[null],null,false,'','','',null);
    this.openSnackBar('Ticket creado con éxito', 'Cerrar')
  }

  clickType(val:TypeTicket){
    this.typeFilter = '';
    this.getSubtypes(val._id);
    this.typeName = val.name;
    this.subTypeName = 'Subtipo';
    this.selectedSubtype = new SubTypeTicket('','','',null,'',[null],null,false,'','','',null);

  }

  clickSubtype(val:SubTypeTicket){
    this.subTypeFilter = '';
    this.selectedSubtype = val;
    this.ticket.team = this.selectedSubtype.team['_id'];
    this.ticket.subTypeTicket = this.selectedSubtype._id;
    
    let day = moment().add(val.resolveDays, "days").format("DD-MM-YYYY");
    // 0 = DOM
    // 6 = SAB
    if(moment(day, "DD-MM-YYYY").weekday() == 6 || moment(day, "DD-MM-YYYY").weekday() == 0){ 
        day = moment(day, "DD-MM-YYYY").add(2, "days").format("DD-MM-YYYY");
    }
    this.ticket.resolveDate = day;

    this.subTypeName = val.name;
    this.selectedSubtype = val;

    this.ticket.sub = this.selectedSubtype.autoSub;
    this.tb.text = this.selectedSubtype.autoDesc;

    let i = Observable.interval(100)
    .subscribe((val) => { 
      $('#editable table').attr('border', '1');  
    });

    setTimeout(() => {
      i.unsubscribe();
      document.getElementById('editable').innerHTML += '<span id="antieditable" contentEditable="false"></span>';
    }, 1000);

  }

  getLenght(val: any[]){
    return val.length;
  }

  checkValidates(){
    if($('.checkvalidate:checked').length == $('.checkvalidate').length){
      this.allChecked = true;
    }else{
      this.allChecked = false;
    }
  }

  goodCheck(){
    this._subTypeTicketService.goodCheck(this.token, this.selectedSubtype._id).subscribe(
      response =>{
          if(!response.subTypeTicket){
            alert('Error en el servidor, actualice la pagina');
          }else{
            this.cancelTicket();
          }
      },
      error =>{
          console.error(error);
      }
    );        
  }

  cancelTicket(){
    this.companyName = 'Departamento'
    this.typeName = 'Tipo';
    this.subTypeName = 'Sub-tipo';
    this.companyFilter = '';
    this.typeFilter = '';
    this.subTypeFilter = '';

    this.filesToUpload = new Array<File>();

    this.selectedSubtype = new SubTypeTicket('','','',null,'',[null],null,false,'','','',null)
    this.ticket = new Ticket('','',null,this.identity['_id'],null,null,'Abierto','','','',null,'PORTAL',[null],'Normal','','',[''],null,null,'');
    this.tb = new TextBlock('','',this.identity['_id'],'','','REQUEST',[''],false);

    this.allChecked = false;


    $("#newticket").modal("hide");
  }

  cleanAttach(){
    this.filesToUpload = undefined;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
        duration: 5000,
    });
  }

  onSubmit(){
    if(this.selectedSubtype.requireAttach && this.filesToUpload == undefined){
      alert('La solicitud requiere de un adjunto obligatorio')
    }else{
      delete this.ticket.createDate;
      delete this.ticket.lastActivity;
      delete this.ticket.rating;
      delete this.ticket.tags;
      delete this.ticket.numTicket;
      if(!this.ticket.team){
        delete this.ticket.team;
        this.ticket.status = 'Abierto'
      }else{
        this.ticket.status = 'Pendiente'
      }

      this.ticket.workTime = this.selectedSubtype.workTime;
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
              this._textblockService.add(this.token, this.tb).subscribe(
                response =>{
                    if(!response.textblock){
                      alert('Generación de chat: error en el servidor');
                    }else{
                      if(this.filesToUpload){
                        this._uploadService.makeFileRequest(this.url+'textblock/file/'+response.textblock._id, [], this.filesToUpload, this.token, 'file');
                    }
                      this.cancelTicket();
                      this.openSnackBar('Ticket creado con éxito', 'Cerrar')
                      this._router.navigate(['/ticket-gestion',link]);
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
    this.tb.text = this.tb.text + val;
    document.getElementById('editable').innerHTML = document.getElementById('editable').innerHTML + val;
  }



  public imagesToUpload: Array<File> = new Array<File>();
  async pastePicture(event: ClipboardEvent) {
    if(event.clipboardData.files.length != 0){
      this.imagesToUpload = new Array<File>();
     
      this.imagesToUpload.push(event.clipboardData.files.item(0));
      console.log(this.imagesToUpload)
      await this._uploadService.makeFileRequest(this.url+'textblock/image', [], this.imagesToUpload, this.token, 'image')
      .then(data =>{
        console.log(data)
        let antiEdit = document.getElementById('antieditable');
        console.log(antiEdit);
        antiEdit.parentNode.removeChild(antiEdit);
        document.getElementById('editable').innerHTML += '<a target="_blank" href="'+this.url+'textblock/image/'+data['filename']+'"><img src="'+this.url+'textblock/image/'+data['filename']+'" class="img-fluid" style="width: 80%; margin: 5px" alt="Responsive image"></a>';
        document.getElementById('editable').innerHTML += '<span id="antieditable" contentEditable="false"></span>';
      })
  
      this.tb.text = document.getElementById('editable').innerHTML;
      this.imagesToUpload = new Array<File>();
    }
  }


  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }


}
