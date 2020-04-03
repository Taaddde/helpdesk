import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { chatService } from 'src/app/services/chat.service';
import { messageService } from 'src/app/services/message.service';
import { userService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { companyService } from 'src/app/services/company.service';
import { teamService } from 'src/app/services/team.service';
import { Company } from 'src/app/models/company';
import { Team } from 'src/app/models/team';
import { Message } from 'src/app/models/message';
import { MessageComponent } from '../message/message.component';
import * as moment from 'moment';
import { GLOBAL } from 'src/app/services/global';
import { Observable } from 'rxjs';
import { Chat } from 'src/app/models/chat';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers:[userService, chatService, messageService, companyService, teamService, MessageComponent]

})
export class ChatComponent implements OnInit {
  @ViewChild(MessageComponent, {static:false}) messageAlert: MessageComponent;

  public identity;
  public token;
  public chat;
  public url: string;


  public companies: Company[];
  public company: Company;
  public teams: Team[];
  public message: Message;
  public messages: Message[];
  public chats: Chat[];
  public myChats: Chat[];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _companyService: companyService,
    private _teamService: teamService,
    private _chatService: chatService,
    private _messageService: messageService,


  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.chat = this._userService.getChat();
    this.url = GLOBAL.url;


    this.message = new Message('','',this.identity['_id'],'','');

    this.messageAlert = new MessageComponent();

   }

  ngOnInit() {
    if(this.identity['role'] != 'ROLE_REQUESTER'){
      this.getChat();
    }
    this.getCompanies();
    if(this.chat && this.chat['company']){
      this.companySelected(this.chat['company']);
    }

    if(this.chat && this.chat['_id']){
      this.getMessages();
    }

  }

  ngAfterViewInit() {
    let i = Observable.interval(100)
    .subscribe((val) => { 
      this.scrollElement()
    });

    setTimeout(() => {
      i.unsubscribe();
    }, 1000);
  }

  getMessages(){
    this._messageService.getList(this.token, this.chat['_id']).subscribe(
      response =>{
          if(!response.messages){
            //this._router.navigate(['/']);
          }else{
            this.messages = response.messages;
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  getChat(){
    this._chatService.getTeamList(this.token, this.identity['_id']).subscribe(
      response =>{
          if(!response.chats){
            //this._router.navigate(['/']);
          }else{
            this.chats = response.chats;
            this.chats.forEach(e => {
              this._messageService.getList(this.token, e._id).subscribe(
                response =>{
                  let text = '';
                    if(response.messages){
                      response.messages.forEach(y => {
                        text = text + y['text'] + '-';
                      });
                      e['prevText'] = text;
                    }
                },
                error =>{
                    console.error(error);
                }
              );
            });
          }
      },
      error =>{
          console.error(error);
      }
    );


    this._chatService.getMyChats(this.token, this.identity['_id']).subscribe(
      response =>{
          if(!response.chats){
            //this._router.navigate(['/']);
          }else{
            this.myChats = response.chats;
          }
      },
      error =>{
          console.error(error);
      }
    );

  }

  getCompanies(){
    this._companyService.getListChat(this.token).subscribe(
      response =>{
          if(!response.companies){
            //this._router.navigate(['/']);
          }else{
            this.companies = response.companies;
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  companySelected(company: Company){
    this.company = company;
    this._teamService.getList(this.token, company._id).subscribe(
      response =>{
          if(!response.teams){
            //this._router.navigate(['/']);
          }else{
            this.teams = response.teams;
            let chat = {};
            if(this.chat){
              chat = this.chat;
            }else{
              chat['company'] = company;
            }
            localStorage.setItem('chat', JSON.stringify(chat));
            this.chat = this._userService.getChat();
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  teamSelected(team: Team){
    let chat = this.chat;
    chat['team'] = team;
    localStorage.setItem('chat', JSON.stringify(chat));
    this.chat = this._userService.getChat();

  }

  finishChat(){
    if(confirm('¿Esta seguro que quiere finalizar la sesión de chat?')){
      localStorage.removeItem('chat');
      this.chat = null;
    }
  }

  back(){
    localStorage.removeItem('chat');
    this.chat = null;
  }

  inTime(){
    let format = 'HHmm'
    let time = moment(),
    chatScheduleFrom = moment(this.company.chatScheduleFrom, format),
    chatScheduleTo = moment(this.company.chatScheduleTo, format);
  
    return (time.isBetween(chatScheduleFrom, chatScheduleTo));
  }

  send(){

    if(this.message.text != ''){
      
      if(this.chat['_id']){
        //Chat existente
        this.message.chat = this.chat['_id'];
        this._messageService.add(this.token, this.message).subscribe(
          response =>{
              if(response.message){
                this.getMessages();
                let input = document.getElementById("text") as HTMLInputElement;
                input.value = '';

              }
          },
          error =>{
              console.error(error);
          }
        );      
      }else{
        //Crear sala de chat
        let chat = new Chat('',null,undefined,this.identity['_id'],this.chat['team']['_id'],this.company._id, null, false);

        this._chatService.add(this.token, chat).subscribe(
          response =>{
              if(response.chat){
                //Insertar mensaje
                this.chat['_id'] = response.chat['_id'];
                localStorage.setItem('chat', JSON.stringify(this.chat));
                this.message.chat = response.chat['_id'];
                this._messageService.add(this.token, this.message).subscribe(
                  response =>{
                      if(response.message){
                        this.getMessages();
                      let input = document.getElementById("text") as HTMLInputElement;
                      input.value = '';
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

    }else{
      //this.messageAlert.error('Mensaje vacío', 'No puede enviar un mensaje sin texto');
    }


    let i = Observable.interval(100)
    .subscribe((val) => { 
      this.scrollCentainElement(this.chat['_id'])
    });

    setTimeout(() => {
      i.unsubscribe();
    }, 1000);
  }

  changeDate(val:string){
    return moment(val, 'YY-MMM-DD HH:mm', 'es').format('DD-MMM-YY HH:mm');
  }

  scrollElement(){
    //get container element
    var container = document.getElementById('chat');
    //scroll down
    container.scrollTop = container.scrollHeight;
  }

  scrollCentainElement(id: string){
    //get container element
    var container = document.getElementById(id);
    //scroll down
    container.scrollTop = container.scrollHeight;
  }

  takeChat(chat: Chat){
    if(confirm('¿Esta seguro que quiere tomar el chat solicitado por '+chat.requester['name']+' '+ chat.requester['surname']+'?')){
      chat.agent = this.identity['_id'];
      this._chatService.edit(this.token, chat._id, chat).subscribe(
        response =>{
            if(response.chat){
              this.getChat();
            }
        },
        error =>{
            console.error(error);
        }
      );
    }
  }

  selectChat(chat:Chat){
    this.chat = chat;
    this.getMessages();

    let i = Observable.interval(300)
    .subscribe((val) => { 
      this.scrollCentainElement(chat._id)
    });

    setTimeout(() => {
      i.unsubscribe();
    }, 1000);
  }

}
