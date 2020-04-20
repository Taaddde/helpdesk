import { Component, OnInit, ViewChild } from '@angular/core';
import { GLOBAL } from 'src/app/services/global';
import { userService } from 'src/app/services/user.service';
import * as moment from 'moment';
import { Work } from 'src/app/models/work';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { teamService } from 'src/app/services/team.service';
import { workService } from 'src/app/services/work.service';
import { MessageComponent } from '../message/message.component';
import { Router } from '@angular/router';
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

  constructor(
    private _userService: userService,
    private _teamService: teamService,
    private _workService: workService,
    private _router: Router,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.state = 'my-tasks';

    this.message = new MessageComponent()

    this.task = new Work('','','',this.identity['_id'],'',undefined,'','','','',false,'No comenzada','Normal');
    this.repeat = 'false';

    this.teamName = '';
    this.agentName = '';
  }

  ngOnInit() {
    this.getTeams()
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
    this.task.userWork = undefined;
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
    this.agentName = agent.name;
  }

  changeState(val:string){
    this.state = val;
  }

  newTask(){
    $("#task-new").modal("show");
  }

  onSubmit(){
    if(this.task.name != '' && this.task.desc != '' && this.task.teamWork != '' && this.task.dateLimit != '' && this.task.dateWork != ''){
      this._workService.add(this.token, this.task, this.repeat, this.dayOfWeek).subscribe(
        response =>{
            if(response.work){
              this.task = new Work('','','',this.identity['_id'],'','','','','','',false,'No comenzada','Normal');
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
            }
        },
        error =>{
            console.error(error);
      });
      
    }else{
      this.message.error('Faltan datos', 'Completa todos los campos que contengan (*)')
    }
    

  }

}