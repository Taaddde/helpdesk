import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'
import { userService } from 'app/services/user.service';
import { ticketService } from 'app/services/ticket.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers:[userService, ticketService]
})

export class ReportsComponent implements OnInit {

  public identity;
  public token;
  public state: String;

  public ticketReport: string;

  public statusReportId: any[];
  public statusReportCount: any[];

  public timeReportId: any[];
  public timeReportCount: any[];

  public statusAgentId: string[];
  public statusAgentName: string[];
  public statusAgentPending: any[];
  public statusAgentFinish: any[];

  
  constructor(
    private _userService: userService,
    private _ticketService: ticketService
  ){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.ticketReport = ''
    this.state = '';

    //Reporte por estado del ticket
    this.statusReportId = new Array<any>();
    this.statusReportCount = new Array<any>();

    //Reporte por tiempo del ticket
    this.timeReportId = new Array<any>();
    this.timeReportCount = new Array<any>();

    //Reporte por estado para agentes
    this.statusAgentId = new Array<string>();
    this.statusAgentName = new Array<string>();
    this.statusAgentPending = new Array<any>();
    this.statusAgentFinish = new Array<any>();

  }

  ngOnInit() {
    this.getTicketReports();
  }

  changeTo(val: string){
    this.state = val;
  }

  getTicketReports(){
    this._ticketService.getReports(this.token).subscribe(
      response =>{
        if(!response.tickets){

        }else{

          response.tickets[0].byStatus.forEach(e => {
            this.statusReportId.push(e['_id']);
            this.statusReportCount.push(e['count']);
          });
          response.tickets[0].byTime.forEach(e => {
            this.timeReportId.push(e['_id']);
            this.timeReportCount.push(e['count']);
          });

          response.tickets[0].byAgent.forEach(e => {
            let value = e['_id']['agent']['_id'];
            let name = e['_id']['agent']['name']+' '+ e['_id']['agent']['surname'];
            if(this.statusAgentId.indexOf(value) === -1){
              this.statusAgentId.push(value);
              this.statusAgentName.push(name);
              this.statusAgentPending[this.statusAgentId.indexOf(value)] = 0;
              this.statusAgentFinish[this.statusAgentId.indexOf(value)] = 0;
            } 
          });

          response.tickets[0].byAgent.forEach(e => {
            let agent = e['_id']['agent']['_id'];
            let status = e['_id']['status'];
            let count = e['count'];
            
            if(status == 'Pendiente'){
              this.statusAgentPending[this.statusAgentId.indexOf(agent)] = this.statusAgentPending[this.statusAgentId.indexOf(agent)] + count;
            }else{
              if(status == 'Finalizado' || status == 'Cerrado'){
                this.statusAgentFinish[this.statusAgentId.indexOf(agent)] = this.statusAgentFinish[this.statusAgentId.indexOf(agent)] + count;
              }
            }
          });
        }
      },
      error =>{
          console.log(error);
      }
    )
  }

}
