import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { User } from 'app/shared/models/helpdesk/user';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var $: any;

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    userService
  ],
})
export class FilterComponent implements OnInit {

  public token: string;
  public identity;

  public filter: any;

  public allRequesters: User[];
  public allAgents: User[];

  public requesters: User[];
  public agents: User[];
  
  public requesterFilter: string;
  public agentFilter: string;
  public statusFilter: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FilterComponent>,
    private _userService: userService,
    private snackBar: MatSnackBar,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
    this.filter = {}

   }

  ngOnInit() {
    this.getRequesters();
    this.getAgents();
  }

  set(item, option){
    switch (option) {
      case 'requester':
        this.filter['requester'] = item['_id'];
        break;
      case 'agent':
        this.filter['agent'] = item['_id'];
        break;
        
      case 'status':
        this.filter['status'] = item;
        break;
      
      default:
        break;
    }
  }

  deleteFilter(val){
    switch (val) {
      case 'requester':
        this.filter['requester'] = null;
        break;
      case 'agent':
        this.filter['agent'] = null;
        break;
      case 'status':
        this.filter['status'] = null;
        break;
      case 'sub':
        this.filter['sub'] = '';
          break;
      case 'numTicket':
        this.filter['numTicket'] = null;
          break;
      default:
        break;
    }

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  getRequesters(){
    this._userService.getList(this.token).subscribe(
      response =>{
          if(response.users){
            if(this.identity['role'] != 'ROLE_REQUESTER'){
              this.allRequesters = response.users;
              this.requesters = response.users;  
            }else{
              if(this.identity['sector']){
                this.allRequesters = response.users.filter(x => x.sector == this.identity['sector']['_id']);
                this.requesters = this.allRequesters;
              }
            }
          }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  getAgents(){
    let i;
    if(this.identity['company']){
      i = this.identity['company']['_id'];
    }else{
      i = 'null';
    }
    this._userService.getListAgents(this.token, i).subscribe(
      response =>{

          if(!response.users){
            //this._router.navigate(['/']);
          }else{
            this.allAgents = response.users
            this.agents = response.users;
          }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');

      }
    );

  }

  sendQuery(){
    if(this.filter['sub'] == ''){
      this.filter['sub'] = null;
    }
    // if(this.identity['role'] == 'ROLE_REQUESTER'){
    //   this.filter['requester'] = this.identity['_id'];
    // }

    this.dialogRef.close(this.filter);
  }

}
