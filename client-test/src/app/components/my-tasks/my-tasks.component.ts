import { Component, OnInit} from '@angular/core';
import {CdkDragDrop, transferArrayItem} from '@angular/cdk/drag-drop'
import { workService } from 'src/app/services/work.service';
import { userService } from 'src/app/services/user.service';
import { Work } from 'src/app/models/work';
import { GLOBAL } from 'src/app/services/global';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss'],
  providers: [userService, workService]

})
export class MyTasksComponent implements OnInit {

  public taskUninitiated: Work[];
  public taskInProgress: Work[];
  public taskWait: Work[];
  public taskPostponed: Work[];

  public taskInContext: Work;

  public identity;
  public token;
  public url: string;

  public isEdit: boolean

  constructor(
    private _userService: userService,
    private _workService: workService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

    this.taskUninitiated = new Array<Work>();
    this.taskInProgress= new Array<Work>();
    this.taskWait= new Array<Work>();
    this.taskPostponed= new Array<Work>();
    this.taskInContext = new Work('','','','','','','','','','',false,'','')
  }

  ngOnInit() {
    this.getTasks();
  }


  getTasks(){
    this.taskUninitiated = new Array<Work>();
    this.taskInProgress= new Array<Work>();
    this.taskWait= new Array<Work>();
    this.taskPostponed= new Array<Work>();

    this._workService.getList(this.token, this.identity['_id']).subscribe(
      response =>{
          if(response.works){
            response.works.forEach((e: Work) => {

              switch(e.status){
                case 'No comenzada':
                  this.taskUninitiated.push(e);
                  break;
                case 'En curso':
                  this.taskInProgress.push(e);
                  break;
                case 'A la espera':
                  this.taskWait.push(e);
                  break;
                case 'Aplazada':
                  this.taskPostponed.push(e);
                  break;
                default:
                  break;
              }

            });
          }
      },
      error =>{
          console.error(error);
    });
  }

  onRightClick(e, task: Work){
    this.taskInContext = task;
    var top = e.pageY;
    var left = e.pageX;
    $("#context-menu").css({
      display: "block",
      top: top,
      left: left
    }).addClass("show");
    return false; //blocks default Webbrowser right click menu
  }

  hideContextMenu(){
    $("#context-menu").removeClass("show").hide();
  }


  onDrop(event: CdkDragDrop<string[]>, status: string){
    //event.container.data es el array para donde va el objeto
    
    if(event.previousContainer == event.container){
      //moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }else{
      let task = event.previousContainer.data[event.previousIndex];
      task['status'] = status;

      this._workService.edit(this.token, task['_id'], task).subscribe(
        response =>{
            if(response.work){
              transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
            }
        },
        error =>{
            console.error(error);
        }
      );

    }
  }

  finishTask(){
    this.hideContextMenu();
    this.taskInContext.status = 'Finalizado';

    this._workService.edit(this.token, this.taskInContext._id, this.taskInContext).subscribe(
      response =>{
          if(response.work){
            this.getTasks();
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  freeTask(){
    this.hideContextMenu();
    if(confirm('¿Esta seguro/a que quiere liberar la tarea para que otro agente la tome?')){
      this.taskInContext.status = 'No comenzada';
      this.taskInContext.userWork = null;
      this._workService.edit(this.token, this.taskInContext._id, this.taskInContext).subscribe(
        response =>{
            if(response.work){
              this.getTasks();
            }
        },
        error =>{
            console.error(error);
        }
      );
  
    }
  }


  changeDate(val:string){
    return moment(val, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY');
  }


  showModal(){
    this.hideContextMenu();

    $("#task-detail").modal("show");

  }

  showModalComments(){
    this.hideContextMenu();

    $("#task-comments").modal("show");

  }


}
