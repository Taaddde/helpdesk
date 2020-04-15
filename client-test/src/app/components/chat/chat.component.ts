import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, EventEmitter, Output } from '@angular/core';
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
import { User } from 'src/app/models/user';

declare var $: any;


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers:[userService, chatService, messageService, companyService, teamService, MessageComponent]

})
export class ChatComponent implements OnInit {
  @ViewChild(MessageComponent, {static:false}) messageAlert: MessageComponent;
  @Output() showChat = new EventEmitter<string>();

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

  public users: User[];

  public messageControl;

  public notifications: string[];

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
 
    this.message = new Message('','',false, this.identity['_id'],'','');

    this.messageAlert = new MessageComponent();
   }

  ngOnInit() {

  
    if(this.identity['role'] != 'ROLE_REQUESTER'){
      this.getChat();
      this.getUsers();
    }else{
      this.getReqChat();
    }    
    this.getCompanies();

    if(this.identity['role'] != 'ROLE_REQUESTER'){
      this.getNotification();
    }


    if(this.chat && this.chat['company']){
      this.companySelected(this.chat['company']);
    }

    this.messageControl = Observable.interval(5000)
    .subscribe((val) => { 
      if(this.chat && this.chat['_id']){
        this.getMessages();
      }

      if(this.identity['role'] != 'ROLE_REQUESTER'){
        this.getChat();

        this.getNotification();
        if(this.chat['_id']){
          this.updateChat();
        }  
      }else{
        this.getReqChat();
      }
    });

  }

  ngAfterViewInit() {
    this.goToBottom();
  }

  goToBottom(){
    let i;
    i = Observable.interval(100)
    .subscribe((val) => { 
      if(this.identity['role'] == 'ROLE_REQUESTER'){
        this.scrollElement()
      }else{
        this.scrollCentainElement(this.chat['_id'])
      }
    });

    setTimeout(() => {
      i.unsubscribe();
    }, 1000);

    setTimeout(() => {
      i.unsubscribe();
    }, 1000);
  }

  ngOnDestroy(){
    this.messageControl.unsubscribe();
    this.back();
  }

  getMessages(){
    this._messageService.getList(this.token, this.chat['_id']).subscribe(
      response =>{
          if(response.messages){
            this.messages = response.messages;

            //Lee el ultimo mensaje
            let lastMessage = this.messages[this.messages.length-1];
            if(!lastMessage.readed && lastMessage.user['_id'] != this.identity['_id']){
              this.readMessages();
              this.goToBottom();
            }
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  getNotification(){
    this._chatService.getForUser(this.token, this.identity['_id']).subscribe(
      response =>{
        this.notifications = new Array<string>()

          if(response.chats){
            response.chats.forEach(e => {
              this.notifications.push(e['chat']);
            });
          }else{
            this.notifications = null;
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  updateChat(){
    this._chatService.getOne(this.token, this.chat['_id']).subscribe(
      response =>{
        this.chat = response.chat;
      },
      error =>{
          console.error(error);
      }
    );
  }

  checkNotifications(id:string){
    return  (this.notifications.indexOf(id) > -1);
  }

  getReqChat(){
    this._chatService.getReqForUser(this.token, this.identity['_id']).subscribe(
      response =>{
          if(response.chat){
            localStorage.setItem('chat', JSON.stringify(response.chat));
            this.chat = this._userService.getChat();
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  readMessages(){
    this._messageService.read(this.token, this.chat['_id']).subscribe(
      response =>{
          if(response.messages){
            this.message = response.messages;
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  getChat(){
    //Lista de chats del equipo sin tomar
    this._chatService.getTeamList(this.token, this.identity['_id']).subscribe(
      response =>{
          if(response.chats){
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

    //Lista de chats que tengo tomados
    this._chatService.getMyChats(this.token, this.identity['_id']).subscribe(
      response =>{
          if(response.chats){
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
          if(response.companies){
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
          if(response.teams){
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
      if(this.identity['role'] == 'ROLE_REQUESTER'){
        this.chat['finishedRequester'] = true;
      }else{
        this.chat['finishedAgent'] = true;
      }

      this._chatService.edit(this.token, this.chat['_id'],this.chat).subscribe(
        response =>{
            if(response.chat){
             this.restartPanel();

            }
        },
        error =>{
            console.error(error);
        }
      );
    }
  }

  getUsers(){
    this._userService.getListAgents(this.token, this.identity['company']['_id']).subscribe(
      response =>{
          if(response.users){
            this.users = response.users;
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  changeAgent(user: User){
    if(confirm('¿Esta seguro que quiere reasignar esta conversación a '+user.name+' '+ user.surname+'?')){
      this.chat['agent'] = user._id;
      this._chatService.edit(this.token, this.chat['_id'], this.chat).subscribe(
        response =>{
            if(response.chat){
              this.restartPanel();
            }
        },
        error =>{
            console.error(error);
        }
      );
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
        let chat = new Chat('',null,undefined,this.identity['_id'],this.chat['team']['_id'],this.company._id, null, false, false);

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
                        this.goToBottom();
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


   this.goToBottom();
  }

  changeDate(val:string){
    return moment(val, 'YY-MMM-DD HH:mm', 'es').format('DD-MMM-YY HH:mm');
  }

  scrollElement(){
    //get container element
    var container = document.getElementById('chat-req');
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

  like(val: Number){
    this.chat.rating = val;
    this._chatService.edit(this.token, this.chat['_id'], this.chat).subscribe(
      response =>{
          if(response.chat){
            localStorage.setItem('chat', JSON.stringify(this.chat));
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  show(){
    this.showChat.next();
  }

  restartPanel(){
    localStorage.removeItem('chat');
    this.chat = null;
    this.getChat();
    $("#principal").addClass('tab-pane active');
    $("#principal-tab").addClass('nav-link active');
    $("#chat").removeClass('active');
    $("#chat-tab").removeClass('active');
  }

}
