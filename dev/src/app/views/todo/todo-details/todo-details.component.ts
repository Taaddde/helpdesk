import { TagDialogueComponent } from './../tag-dialogue/tag-dialogue.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TodoItem } from 'app/shared/models/todo.model';
import { MatDialog } from '@angular/material/dialog';
import PerfectScrollbar from 'perfect-scrollbar';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { todoService } from 'app/shared/services/helpdesk/todo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tagService } from 'app/shared/services/helpdesk/tag.service';
import { teamService } from 'app/shared/services/helpdesk/team.service';
import { Team } from 'app/shared/models/helpdesk/team';
import { User } from 'app/shared/models/helpdesk/user';
import { Tag } from 'app/shared/models/helpdesk/tag';
import { TodoService } from '../todo.service';
import { notificationService } from 'app/shared/services/helpdesk/notification.service';
import { Notification } from 'app/shared/models/helpdesk/notification';
import * as moment from 'moment';
import { APP_DATE_FORMATS, AppDateAdapter } from 'app/shared/services/date-adapter';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { FileInput } from 'ngx-material-file-input';
import { uploadService } from 'app/shared/services/helpdesk/upload.service';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { TodoRepiteComponent } from './todo-repite/todo-repite.component';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    notificationService, uploadService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodoDetailsComponent implements OnInit {
  public todo: TodoItem = {
    title: '',
    note: '',
    response: '',
    startDate: '', 
    dueDate: '',
    done: false,
    important: false,
    starred: false,
    read: false,
    selected: false,
    tags:[],
    users: [],
    usersWhoRead: [],
    files: [],
    company: ''
  };

  a: PerfectScrollbar;
  tagList: Tag[];

  public token: string;
  public identity;
  public url: string = GLOBAL.url;

  public teams: Team[];
  public teamName = '';
  public agents: Array<any>;
  public agentsIn: Array<any>;

  public files: FileInput;

  public repite: any;
  
  constructor(
    private todoService: TodoService,
    private tagDialogue: MatDialog,
    private _userService: userService,
    private _todoService: todoService,
    private _tagService: tagService,
    private _teamService: teamService,
    private _notificationService: notificationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private _uploadService: uploadService,
    private cdr: ChangeDetectorRef) 
    {
      this.token = _userService.getToken();
      this.identity = _userService.getIdentity();

      this.agentsIn = new Array()
    }

  ngOnInit() {
    this.getTodo();
   
    this.getTags();
    this.getTeams();

  }

  //TODO
  getTodo(){
    let id = this.route.snapshot.params['id'];

    if(id) {
      this._todoService.getOne(this.token, id).subscribe(
          response =>{
            if(response.todo){
               this.todo = response.todo;
               this.cdr.markForCheck();
               if(this.todo.users){
                  this.agentsIn = this.todo.users;
                }

                if(this.todo.team){
                  this.teamName = this.todo.team['name'];
                  this.getAgents(this.todo.team['users']);
                }
            }
          },
          error =>{
            this.openSnackBar(error.message, 'Cerrar');
          }
      );
    }
  }

  //AGENTES
  getAgents(users){
    this.agents = users;
  }

  setAgent(user: User){
    this.agentsIn.push(user);
  }

  deleteAgent(user: User){
    this.agentsIn.splice(this.agentsIn.indexOf(user),1);
  }

  //EQUIPO
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

  setTeam(team: Team){
    this.todo.team = team._id;
    this.agentsIn = new Array();
    this.getAgents(team.users);
  }

  
  saveTodo(finish:boolean) {
    if(this.agentsIn.length == 0)
      return this.openSnackBar('Se debe asignar algún agente responsable de esta tarea', 'Cerrar');
    if(finish)
      this.todo.done = true;

    if(this.agentsIn){
      let ids = new Array();
      this.agentsIn.forEach(agent => {
        ids.push(agent._id);
      });
      this.todo.users = ids;
    }

    this.todo.company = this.identity['company']['_id'];

    if(!this.todo._id){
      this.todo.userCreate = this.identity['_id'];
      if(this.repite){
        let dates = this.getRepiteDates();
        dates.forEach(date => {
          this.todo.startDate = moment(date).format('YYYY-MM-DD');
          this.todo.dueDate = moment(date).format('YYYY-MM-DD');
          this.addTodo();
        });
      }else{
        this.addTodo();
      }
    }else{
      this._todoService.edit(this.token, this.todo._id, this.todo).subscribe(
        response =>{
          if(response.todo){
            this.uploadFile(response.todo._id);
            let query = {todo: this.todo._id};
            if(this.todo.done == false){
              this._notificationService.getList(this.token, query).subscribe(
                response =>{
                  if(response.notifications){
                     let notif: Notification[] = response.notifications;
                     notif.forEach(n => {

                      if(this.todo.users.indexOf(n.user) != -1){
                        this.todo.users.splice(this.todo.users.indexOf(n.user), 1);
                        n.message = this.todo.title;
                        let dateInit = moment(this.todo.startDate).format('YYYY-MM-DD HH:mm');
                        n.date = dateInit;
                        n.dateInit = dateInit;
                        this._notificationService.edit(this.token, n._id, n).subscribe(
                            response =>{
                            },
                            error =>{
                              this.openSnackBar(error.message, 'Cerrar');
                            }
                        );
                      }else{
                        this._notificationService.delete(this.token, n._id).subscribe(
                            response =>{},
                            error =>{
                              this.openSnackBar(error.message, 'Cerrar');
                            }
                        );
                      }
                     });
                     if(this.todo.users.length > 0){
                       this.todo.users.forEach(user => {
                        let dateInit = moment(this.todo.startDate).format('YYYY-MM-DD HH:mm');
                        let notif = new Notification('',this.todo.title, 'list_alt', dateInit, dateInit, 'todo/list/'+this.todo._id, 'accent', user, null, this.todo._id);
                        this._notificationService.add(this.token, notif).subscribe(
                            response =>{},
                            error =>{}
                        );
                       });
                     }
                  }
                },
                error =>{
                  this.openSnackBar(error.message, 'Cerrar');
                }
              );
            }
            
            this.router.navigateByUrl("/todo/list");
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
      );
    }

  }

  getRepiteDates(): string[]{
    var result: string[] = new Array<string>();

    let now = moment(this.repite['firstDate']);
    let limitDay = this.repite['lastDate'];

    if(this.repite.type == 'Cada semana'){
      let repeatParams = this.repite['dayOfWeek'];
      let daysRepeat = [];

      if(repeatParams['lun']){
          daysRepeat.push(1);
      }
      if(repeatParams['mar']){
          daysRepeat.push(2);
      }
      if(repeatParams['mie']){
          daysRepeat.push(3);
      }
      if(repeatParams['jue']){
          daysRepeat.push(4);
      }
      if(repeatParams['vie']){
          daysRepeat.push(5);
      }
      if(repeatParams['sab']){
          daysRepeat.push(6);
      }
      
      if(!daysRepeat.includes(now.weekday())){
          //Buscar primer día
          now.add(1, 'day');
          while (!daysRepeat.includes(now.weekday())) {
            now.add(1, 'day');
          }
      }

      while (now.isBefore(limitDay)) {
          if(daysRepeat.includes(now.weekday())){
            result.push(now.format('YYYY-MM-DD'))
          }

          now.add(1, 'day');
      }
    }else{
      let cantDays = this.repite['forDays']
      result.push(now.format('YYYY-MM-DD'));
      while (now.isBefore(limitDay)) {
        now.add(cantDays, 'day');
        if(now.weekday() == 0)
          now.add(1, 'day');
        result.push(now.format('YYYY-MM-DD'));
      }
    }
    return result;
  }

  addTodo(){
    this._todoService.add(this.token, this.todo).subscribe(
      response =>{
        if(response.todo){
          this.uploadFile(response.todo._id);
          this.todo.users.forEach(user => {
            let dateInit = moment(this.todo.startDate).format('YYYY-MM-DD HH:mm');
            let notif = new Notification('',this.todo.title, 'list_alt', dateInit, dateInit, 'todo/list/'+response.todo._id, 'accent', user, null, response.todo._id);
            this._notificationService.add(this.token, notif).subscribe(
                response =>{},
                error =>{}
            );
          });
          this.router.navigateByUrl("/todo/list");
        }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  uploadFile(id){
    if(this.files != undefined && this.files != null){
      let fileToUpload = this.files.files;
      this._uploadService.makeFileRequest(this.url+'todo/file/'+id, [], fileToUpload, this.token, 'file')
      .then(
          result =>{
          }, 
          error =>{
            this.openSnackBar(error.message, 'Cerrar');
          }
      );
    }
  }

  deleteTodo() {
    if(this.todo._id != ''){
      this._todoService.delete(this.token, this.todo._id).subscribe(
        response =>{
          if(response.todo){
            this.router.navigateByUrl("/todo/list");
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
      );
    }else{
      this.router.navigateByUrl("/todo/list");
    }
  }

  //TAGS
  getTags(){
    this._tagService.getList(this.token, {company: this.identity['company']['_id']}).subscribe(
        response =>{
          if(response.tags){
             this.tagList = response.tags;
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }

  updateTodoTag(tag) {
    this._todoService.addTag(this.token, this.todo._id, tag._id).subscribe(
        response =>{
          if(response.todo){
            this.todo.tags.push(tag);
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }

  removeTagFromTodo(tag) {
    this._todoService.removeTag(this.token, this.todo._id, tag._id).subscribe(
      response =>{
        if(response.todo){
          this.todo.tags.splice(this.todo.tags.indexOf(tag),1);
        }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
  );
  }

  openTagManaginDialogue() {
    const dialogRef = this.tagDialogue.open(TagDialogueComponent, {
      // width: '250px',
      // data: {name: "", animal: ""}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getTags();
    });
  }

  openRepiteTodos() {
    const dialogRef = this.tagDialogue.open(TodoRepiteComponent, {
      width: '80%',
      data: {title: "Repetición"}
    });

    dialogRef.afterClosed().subscribe(res => {

      if(!res)
        return;

      this.repite = res;
      this.todo.startDate = this.repite['fistDate'];
      this.todo.dueDate = this.repite['lastDate'];
    });
  }


  toggleImportant() {
    if(this.userInTodo()){
      this.todo.important = !this.todo.important;
    }else{
      this.openSnackBar('No tienes permisos para modificar esta tarea', 'Cerrar');
    }
  }

  toggleStar() {
    if(this.userInTodo()){
      this.todo.starred = !this.todo.starred;
    }else{
      this.openSnackBar('No tienes permisos para modificar esta tarea', 'Cerrar');
    }
  }

  toggleRead() {
    if(this.userInTodo()){
      if(this.todo.read == true){
        this.todo.usersWhoRead.splice(this.todo.usersWhoRead.indexOf(this.identity['_id']), 1);
      }else{
        this.todo.usersWhoRead.push(this.identity['_id']);
      }
      this.todo.read = !this.todo.read;
    }else{
      this.openSnackBar('No tienes permisos para modificar esta tarea', 'Cerrar');
    }
  }

  toggleDone() {
    if(this.userInTodo()){
      this.todo.done = !this.todo.done;
    }else{
      this.openSnackBar('No tienes permisos para modificar esta tarea', 'Cerrar');
    }
  }

  userInTodo(): boolean{   
    if(this.todo.users){
      return this.todo.users?.map(x => x['_id']).indexOf(this.identity['_id']) != -1;
    }else{
      return false;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
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

  goToLink(url: string){
    window.open(this.url+'todo/file/'+url, "_blank");
  }

  removeFileFromTodo(file: string){
    this.todo.files.splice(this.todo.files.indexOf(file), 1);
  }
}