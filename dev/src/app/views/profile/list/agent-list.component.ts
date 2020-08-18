import { Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agent-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [userService]
})
export class AgentListComponent implements OnInit {

  public token: string;
  public identity;
  public query: any;
  rows = [];
  public columns = [];
  temp = [];

  public canCreate = false;

  constructor(
    private _userService: userService,
    private _route: ActivatedRoute,
    private _router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
  }

  ngOnInit() {
    this.getColumns();
    this.getUsers();

    if(this.identity['role'] == 'ROLE_ADMIN'){
      this.canCreate = true;
    }
  }

  getUsers(){
    this._userService.getListAgents(this.token, this.identity['company']['_id']).subscribe(
      response =>{
          if(response.users){
            this.rows = response.users;
            this.temp = response.users;
          }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  
  setQuery(){
    this.query = {}
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  getColumns(){
    this.columns = [
      {
        prop: 'name',
        name: 'Nombre',
        flexGrow: 1
      },
      {
        prop: 'surname',
        name: 'Apellido',
        flexGrow: 1
      },
      {
        prop: 'email',
        name: 'Email',
        flexGrow: 1
      },
      {
        prop: 'phone',
        name: 'Interno',
        flexGrow: 1
      },
      {
        prop: 'userName',
        name: 'Usuario',
        flexGrow: 1
      },
    ];
  }

  changeDate(val:string){
    return moment(val, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm');
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    var columns = Object.keys(this.temp[0]);
    // Removes last "$$index" from "column"
    columns.splice(columns.length - 1);

    // console.log(columns);
    if (!columns.length)
      return;

    const rows = this.temp.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        let column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });

    this.rows = rows;

  }

  toNew() {
    this._router.navigate(['/user/new/agent']);
  }

  toProfile(event) {

    if(event.type == 'click') {
      this._router.navigate(['/user/profile/', event.row._id]);
    }
  }

}