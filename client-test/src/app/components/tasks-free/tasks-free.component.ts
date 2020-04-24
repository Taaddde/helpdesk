import { Component, OnInit } from '@angular/core';
import { workService } from 'src/app/services/work.service';
import { userService } from 'src/app/services/user.service';
import { Work } from 'src/app/models/work';
import { GLOBAL } from 'src/app/services/global';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-tasks-free',
  templateUrl: './tasks-free.component.html',
  styleUrls: ['../my-tasks/my-tasks.component.scss'],
  providers: [userService, workService]

})
export class TasksFreeComponent implements OnInit {


  public taskFree: Work[];
  public taskInContext: Work;

  public identity;
  public token;
  public url: string;


  constructor(
    private _userService: userService,
    private _workService: workService,
  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

    this.taskFree= new Array<Work>();
    this.taskInContext = new Work('','','','','','','','','','',false,'','')

  }

  ngOnInit() {
    this.getTasks()
  }

  getTasks(){
    this.taskFree= new Array<Work>();

    this._workService.getFreeList(this.token, this.identity['_id']).subscribe(
      response =>{
          if(response.works){
            this.taskFree = response.works;
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

  changeDate(val:string){
    return moment(val, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY');
  }


  showModal(){
    this.hideContextMenu();

    $("#task-detail").modal("show");

  }

  showModalTask(task: Work){
    this.hideContextMenu();
    this.taskInContext = task;
    $("#task-detail").modal("show");

  }


  takeTask(){
    this.hideContextMenu();
    this.taskInContext.status = 'No comenzada';
    this.taskInContext.userWork = this.identity['_id'];
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
