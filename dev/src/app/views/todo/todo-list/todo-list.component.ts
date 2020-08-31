import { ChangeDetectorRef, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { TodoService } from "../todo.service";
import { TodoItem, TagItem } from "app/shared/models/todo.model";
import { debounceTime, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { todoService } from "app/shared/services/helpdesk/todo.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { userService } from "app/shared/services/helpdesk/user.service";
import { Tag } from "app/shared/models/helpdesk/tag";
import { tagService } from "app/shared/services/helpdesk/tag.service";

@Component({
  selector: "app-todo-list",
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodoListComponent implements OnInit, OnDestroy {
  todoList: TodoItem[];
  tempList: TodoItem[];
  searchTerm: string;
  test: string;
  tagList: TagItem[];
  tags: Tag[];
  tagMap: Map<number, string> = new Map<number, string>();
  isMasterToggled: boolean = false;
  toggledItemNumber: number = 0;
  unsubscribeAll: Subject<any>;

  filter = 'Mios';

  public token: string;
  public identity;

  constructor(
    private todoService: TodoService,
    private _todoService: todoService,
    private _userService: userService,
    private _tagService: tagService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  ) {
    this.unsubscribeAll = new Subject();

    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
  }

  ngOnInit() {
    this.getTodo();
    this.getTags();

    this.todoService.getSearchTerm().pipe(debounceTime(250))
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(term => {
      this.searchTerm = term;
      this.cdr.markForCheck();
    });
  }

  getTodo(){
    this._todoService.getList(this.token, {}).subscribe(
        response =>{
          if(response.todos){
            this.tempList = response.todos;
            this.todoList = this.tempList.filter(t=>t.users?.map(x => x['_id']).indexOf(this.identity['_id']) != -1);
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }

  getTags(){
    this._tagService.getList(this.token, {}).subscribe(
        response =>{
          if(response.tags){
             this.tags = response.tags;
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  drop(event: CdkDragDrop<TodoItem[]>) {
    moveItemInArray(this.todoList, event.previousIndex, event.currentIndex);
    // Do what you need with the re-arranged array "todoList"
    this.cdr.markForCheck();
  }

  filterTodoListOnTag(tagSearch) {
    let filter: TodoItem[] = new Array<TodoItem>();

    this.tempList.forEach(todo => {
      if(todo.tags){
        for (let i = 0; i < todo.tags.length; i++) {
          if(todo.tags[i]['name'] == tagSearch['name']){
            filter.push(todo);
            break;
          } 
        }
      }
    });

    this.todoList = filter;
  }

  onTodoOptionSelected(event) {
    switch (event.target.innerText) {
      case "Todo":
        this.todoList = this.tempList;
        this.filter = 'Todo';
        break;
      case "Mios":
        this.todoList = this.tempList.filter(t=>t.users?.map(x => x['_id']).indexOf(this.identity['_id']) != -1);
        this.filter = 'Mios';
        break;
      case "Leído":
        this.todoList = this.tempList.filter(t=>t.users?.map(x => x['_id']).indexOf(this.identity['_id']) != -1 && t.usersWhoRead?.includes(this.identity['_id']));
        this.filter = 'Leído';
        break;

      case "No leído":
        this.todoList = this.tempList.filter(t=>t.users?.map(x => x['_id']).indexOf(this.identity['_id']) != -1 && !t.usersWhoRead?.includes(this.identity['_id']));
        this.filter = 'No leído';
        break;

      case "Importante":
        this.todoList = this.tempList.filter((todo: TodoItem) => {
          return todo.important;
        });
        this.filter = 'Importante';
        break;

      case "No Importante":
        this.todoList = this.tempList.filter((todo: TodoItem) => {
          return !todo.important;
        });
        this.filter = 'No Importante';
        break;

      case "Realizado":
        this.todoList = this.tempList.filter((todo: TodoItem) => {
          return todo.done;
        });
        this.filter = 'Realizado';
        break;

      case "No Realizado":
      this.todoList = this.tempList.filter((todo: TodoItem) => {
        return !todo.done;
      });
      this.filter = 'No Realizado';
      break;

      case "Favorito":
        this.todoList = this.tempList.filter((todo: TodoItem) => {
          return todo.starred;
        });
        this.filter = 'Favorito';
        break;

      case "No Favorito":
        this.todoList = this.tempList.filter((todo: TodoItem) => {
          return !todo.starred;
        });
        this.filter = 'No favorito';
        break;

      default:
        break;
    }

    this.cdr.detectChanges();
  }

  masterToggle() {
    this.toggledItemNumber = 0;

    this.isMasterToggled = !this.isMasterToggled;

    if (this.isMasterToggled) {
      this.todoList.forEach((todo: TodoItem) => {
        todo.selected = true;
        this.toggledItemNumber++;
      });
    } else {
      this.todoList.forEach((todo: TodoItem) => {
        todo.selected = false;
        this.toggledItemNumber--;
      });
    }

    this.cdr.detectChanges();
  }

  toggleCheckBox(todo: TodoItem) {
    todo.selected = !todo.selected;
    if (todo.selected) this.toggledItemNumber++;
    else this.toggledItemNumber--;

    if (this.toggledItemNumber == this.todoList.length)
      this.isMasterToggled = true;
    else if (this.toggledItemNumber == 0) this.isMasterToggled = false;
  }

  toggleImportant(todo: TodoItem) {
    if(this.userInTodo(todo)){
      todo.important = !todo.important;
      this.updateTodo(todo);  
    }else{
      this.openSnackBar('No tienes permisos para modificar esta tarea', 'Cerrar');
    }
  }

  toggleStar(todo: TodoItem) {
    if(this.userInTodo(todo)){
      todo.starred = !todo.starred;
      this.updateTodo(todo);  
    }else{
      this.openSnackBar('No tienes permisos para modificar esta tarea', 'Cerrar');
    }
  }

  toggleRead(todo: TodoItem) {
    if(todo.usersWhoRead?.includes(this.identity['_id'])){
      todo.usersWhoRead.splice(todo.usersWhoRead.indexOf(this.identity['_id']), 1);
    }else{
      todo.usersWhoRead.push(this.identity['_id']);
    }

    this.updateTodo(todo);  

  }

  toggleDone(todo: TodoItem) {
    if(this.userInTodo(todo)){
      todo.done = !todo.done;
      this.updateTodo(todo);  
    }else{
      this.openSnackBar('No tienes permisos para modificar esta tarea', 'Cerrar');
    }
  }

  updateTodo(todo: TodoItem){
    this._todoService.edit(this.token, todo._id, todo).subscribe(
      response =>{
        
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
  );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  userInTodo(todo: TodoItem): boolean{   
    if(todo.users){
      return todo.users?.map(x => x['_id']).indexOf(this.identity['_id']) != -1;
    }else{
      return false;
    }
  }

}
