import { Component, OnInit } from '@angular/core';
import { workService } from 'src/app/services/work.service';
import { userService } from 'src/app/services/user.service';
import { Work } from 'src/app/models/work';
import { GLOBAL } from 'src/app/services/global';
import * as moment from 'moment';
import { User } from 'src/app/models/user';
import { Team } from 'src/app/models/team';
import { teamService } from 'src/app/services/team.service';
declare var $: any;

@Component({
  selector: 'app-tasks-free',
  templateUrl: './tasks-free.component.html',
  styleUrls: ['../../styles/list.scss'],
  providers: [userService, workService, teamService]

})
export class TasksFreeComponent implements OnInit {

  public taskFree: Work[];
  public taskInContext: Work;

  public identity;
  public token;
  public url: string;

  public limit: number;
  public page: number;
  public nextPage: boolean;
  public prevPage: boolean;
  public totalDocs: number;
  public totalPages: number;
  public pagingCounter: number;


  public users: User[];
  public teams: Team[];

  public query: any;

  public takeTicketDesc: string;

  constructor(
    private _userService: userService,
    private _workService: workService,
    private _teamService: teamService,
  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

    this.taskFree= new Array<Work>();
    this.taskInContext = new Work('','','','','','','','','','',false,'',false,'',undefined)


    this.limit= 10;
    this.page= 1;
    this.nextPage = true;
    this.prevPage= false;
    this.totalDocs= null;
    this.totalPages= 1;
    this.pagingCounter = 1;

    this.takeTicketDesc = 'Tomar'

    this.query = {free:true}
  }

  ngOnInit() {
    this.getTasks();
    this.getUsers();
    this.getTeams();
  }

  getTasks(){
    this.taskFree= new Array<Work>();

    this._workService.getListPaged(this.token, this.page, this.limit,  this.query, this.identity['_id']).subscribe(
      response =>{
          if(response.works){
            this.taskFree = response.works.docs;
            this.limit = response.works.limit;
            this.nextPage = response.works.nextPage;
            this.prevPage = response.works.prevPage;
            this.totalDocs = response.works.totalDocs;
            this.totalPages = response.works.totalPages;
            this.pagingCounter = response.works.pagingCounter;
          }
      },
      error =>{
          console.error(error);
      }
    );
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

  getTeams(){
    this._teamService.getList(this.token, this.identity['company']['_id']).subscribe(
      response =>{
          if(response.teams){
            this.teams = response.teams;
          }
      },
      error =>{
          console.error(error);
      }
    );

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

  changeWorkDate(val:string){
    return moment(val, 'YYYY-MM-DD').format('DD-MM-YYYY');
  }

  changeCreatedDate(val:string){
    return moment(val, 'YYYY-MMM-DD HH:mm').format('DD-MM-YYYY');
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
    this.taskInContext.status = 'No comenzada';
    this.taskInContext.userWork = this.identity['_id'];
    this.taskInContext.free = false;
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

  isLastPage(){
    if(this.totalDocs < this.pagingCounter+this.limit){
      return this.totalDocs;
    }else{
      return this.pagingCounter+this.limit-1;
    }
  }

  goTo(page: number){
    this.page = page;
    this.getTasks();
  }

  set(item, option){
    switch (option) {
      case 'createdBy':
        this.query['createdBy'] = item['_id'];
        $('#createdByName').val(item['name']+' '+item['surname']);
  
        break;
      case 'team':
        this.query['teamWork'] = item['_id'];
        $('#teamName').val(item['name']);
  
        break;
      default:
        break;
    }
  }

  deleteFilter(val){
    switch (val) {
      case 'createdBy':
        this.query['createdBy'] = null;
        $('#createdByName').val('');

        break;
      case 'name':
        this.query['name'] = '';
          break;
      case 'tag':
        this.query['tag'] = '';
       break;
    
      default:
        break;
    }

  }

  filterArguments(){
    if(this.query['name'] == ''){
      this.query['name'] = null;
    }

    $("#filter").modal("hide");
    this.getTasks();
  }


}
