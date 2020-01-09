import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import {GLOBAL} from '../../services/global'
import * as moment from 'moment';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements AfterViewInit {

  @Input() text: string;
  @Input() sign: string;
  @Input() user: string;
  @Input() date: string;
  @Input() type: string;
  @Input() files: string;

  public groupFiles: string[];

  public url: string;

  constructor(
    
  ) {
    this.url = GLOBAL.url;
   }

  ngOnInit(){
    this.date = moment(this.date, "YYYY-MM-DD HH:mm").format("DD-MM-YYYY HH:mm");
    this.groupFiles = this.files.split(',')
  }

  ngAfterViewInit() {
    this.scrollElement();
  }

  scrollElement(){
    //get container element
    var container = document.getElementById('chatbox-scroll');
    //scroll down
    container.scrollTop = container.scrollHeight;
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
        tmp = {card:true, chatinfo:true};
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


}
