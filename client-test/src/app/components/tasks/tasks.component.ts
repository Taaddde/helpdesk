import { Component, OnInit, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/global';
import { userService } from 'src/app/services/user.service';
import * as moment from 'moment';
import { Work } from 'src/app/models/work';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { teamService } from 'src/app/services/team.service';
import { workService } from 'src/app/services/work.service';
import { MessageComponent } from '../message/message.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MyTasksComponent } from '../my-tasks/my-tasks.component';
declare var $: any;

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  providers: [userService, teamService, workService,MessageComponent]

})
export class TasksComponent implements OnInit {

  @ViewChild(MessageComponent, {static:false}) message: MessageComponent;
  @ViewChild(MyTasksComponent, {static:false}) myTasks: MyTasksComponent;

  public identity;
  public token;
  public url: string;

  public teams: Team[];
  public teamName: string;
  public agents: User[];
  public agentName: string;

  public state: string;
  public task: Work;

  public dayOfWeek = {
    lun: false,
    mar: false,
    mie: false,
    jue: false,
    vie: false,
    sab: false
  }

  public repeat: string;
  public countFree: number;

  constructor(
    private _userService: userService,
    private _teamService: teamService,
    private _workService: workService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.state = 'my-tasks';

    this.message = new MessageComponent()
    this.myTasks = new MyTasksComponent(_userService, _workService);

    this.task = new Work('','','',this.identity['_id'],'',null,'','','','',false,'No comenzada',true,'Normal',undefined);
    this.repeat = 'false';

    this.teamName = '';
    this.agentName = '';
    this.countFree = 0;
  }

  ngOnInit(){
    this.getTeams();
    this.getCount();
  }
  
  getCount(){
    this._workService.getFreeCount(this.token, this.identity['_id']).subscribe(
      response =>{
          if(response.count){
            this.countFree = response.count;
          }
      },
      error =>{
          console.error(error);
    });
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
    });
  }

  getAgents(team: Team){
    this.task.userWork = null;
    this.agentName = 'Agente responsable'
    this.task.teamWork = team._id;
    this.teamName = team.name;
    this._teamService.getAgentsList(this.token, team._id, this.identity['company']['_id']).subscribe(
      response =>{
          if(response.usersIn){
            this.agents = response.usersIn;
          }
      },
      error =>{
          console.error(error);
    });
  }

  selectAgent(agent: User){
    this.task.userWork = agent._id;
    this.task.free = false;
    this.agentName = agent.name;
  }

  changeState(val:string){
    this.state = val;
  }

  newTask(){
    $("#task-new").modal("show");
  }

  onSubmit(){
    if(this.task.name != '' && this.task.desc != '' && this.task.teamWork != '' && this.task.dateLimit != '' && (this.task.dateWork != '' || this.repeat == 'true')){
      if(moment(this.task.dateLimit).isSameOrAfter((moment().format("YYYY-MM-DD")))){

        if(this.task.userWork != ''){
          this.task.status = 'No comenzada'
        }else{
          this.task.status = 'Libre'
        }

        this._workService.add(this.token, this.task, this.repeat, this.dayOfWeek).subscribe(
          response =>{
              if(response.work){
                console.log(response.work)




                this.task = new Work('','','',this.identity['_id'],'','','','','','',false,'No comenzada',true,'Normal',undefined);
                this.dayOfWeek = {
                  lun: false,
                  mar: false,
                  mie: false,
                  jue: false,
                  vie: false,
                  sab: false
                };
                this.repeat = 'false';
                this.teamName = '';
                this.agentName = '';
                $("#task-new").modal("hide");
                this.message.success('Completado', 'Tarea creada con éxito.');
                this.myTasks.getTasks();
              }
          },
          error =>{
              console.error(error);
        });
      }else{
        this.message.error('Incongruencia de fechas', 'No es posible seleccionar una fecha límite menor al día de hoy')
      }
     
      
    }else{
      this.message.error('Faltan datos', 'Completa todos los campos que contengan (*)')
    }
    

  }

}