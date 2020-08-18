import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import {GLOBAL} from 'app/shared/services/helpdesk/global'
import * as moment from 'moment';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { textblockService } from 'app/shared/services/helpdesk/textblock.service';

declare var $: any;


@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
  providers: [userService, textblockService]
})
export class ChatboxComponent implements AfterViewInit {

  @Input() _id: string;
  @Input() text: string;
  @Input() sign: string;
  @Input() user: string;
  @Input() userId: string;
  @Input() date: string;
  @Input() type: string;
  @Input() files: string;
  @Input() info: string;

  @Output() deleteMessage = new EventEmitter<string>();
  @Output() errorMessage = new EventEmitter<string>();
  @Output() refresh = new EventEmitter<string>();

  public groupFiles: string[];

  public identity;
  public token;
  public url: string;

  constructor(
    private _textblockService: textblockService,
    private _userService: userService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
   }

  ngOnInit(){
    this.date = moment(this.date, "YYYY-MM-DD HH:mm").format("DD-MM-YYYY HH:mm");
    this.groupFiles = this.files.split(',');

  }

  ngAfterViewInit() {
    this.scrollElement();
    $('table').attr('border', '1');  
  }

  scrollElement(){
    //get container element
    var container = document.getElementById('chatbox-scroll');
    //scroll down
    container.scrollTop = container.scrollHeight;
 }


  checkExt(url){
    let data: string = url;
    let ext = data.split('\.')[1];
    if(
      ext != 'pdf' && 

      ext != 'xlsx' && 
      ext != 'xls' && 

      ext != 'msg' && 

      ext != 'docx' &&
      ext != 'odt' &&

      ext != 'rar' && 
      ext != 'zip' && 

      ext != 'png' && 
      ext != 'jpge' && 
      ext != 'jpeg' && 
      ext != 'jpg' && 
      ext != 'tif' && 
      ext != 'tiff'
    ){
      return false;
    }else{
      return ext;
    }
  }


  getCardClass(){
    var tmp;
    switch(this.type){
      case 'PUBLIC':
        tmp = {card:true, chatbox:true};
        break;
      case 'PRIVATE':
        tmp = {card:true, chatbox:true};
        break;
      case 'INFO':
        if(this.info == 'true'){
          tmp = {card:true, chatinfo:true};
        }else{
          tmp = {diplaynone:true};
        }
        break;
      case 'REQUEST':
        tmp = {card:true, chatbox:true, 'ml-auto':true};
        break;
      default:
        alert('Hubo un problema con la conversación del ticket, por favor reportarlo al administrador');
        break;
    }
    return tmp;
  }

  getContainerClass(){
    var tmp;
    switch(this.type){
      case 'PUBLIC':
        tmp = {container:true, chatheader:true};
        break;
      case 'PRIVATE':
        tmp = {container:true, chatheader:true};
        break;
      case 'INFO':
        tmp = {container:true, infoheader:true};
        break;
      case 'REQUEST':
        tmp = {container:true, chatheaderreq:true};
        break;
      default:
        alert('Hubo un problema con la conversación del ticket, por favor reportarlo al administrador');
        break;
    }

    return tmp;
  }

  getCardBodyClass(){
    var tmp;
    if(this.type == 'PRIVATE'){
      tmp = {'card-body':true, chatprivate:true}
    }else{
      tmp = {'card-body':true}
    }

    return tmp;
  }

  delete(){
    let now = moment().format('YYYY-MM-DD HH:ss');
    let createDate = moment(this.date,'DD-MM-YYYY HH:ss').add(2, 'hours').format('YYYY-MM-DD HH:ss');
    if(moment(now).isSameOrBefore(createDate)){
      this.updateChatbox();
    }else{
      this.errorMessage.next();
    }
  }

  updateChatbox(){
    this._textblockService.delete(this.token, this._id).subscribe(
      response =>{
          if(response.textblock){
            this.deleteMessage.next();
            this.refresh.next();
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
