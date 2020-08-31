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

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoDetailsComponent implements OnInit {

  public todo: TodoItem = {
    title: '',
    note: '',
    startDate: '',
    dueDate: '',
    done: false,
    important: false,
    starred: false,
    read: false,
    selected: false,
    tags:[],
    users: [],
    usersWhoRead: []
  };

  a: PerfectScrollbar;
  tagList: Tag[];

  public token: string;
  public identity;

  public teams: Team[];
  public teamName = '';
  public agents: Array<any>;
  public agentsIn: Array<any>;

  
  constructor(
    private todoService: TodoService,
    private tagDialogue: MatDialog,
    private _userService: userService,
    private _todoService: todoService,
    private _tagService: tagService,
    private _teamService: teamService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
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

  
  saveTodo() {
    if(this.agentsIn){
      let ids = new Array();
      this.agentsIn.forEach(agent => {
        ids.push(agent._id);
      });
      this.todo.users = ids;
    }

    if(!this.todo._id){
      this._todoService.add(this.token, this.todo).subscribe(
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
      this._todoService.edit(this.token, this.todo._id, this.todo).subscribe(
        response =>{
          if(response.todo){
            this.router.navigateByUrl("/todo/list");
          }
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
}
