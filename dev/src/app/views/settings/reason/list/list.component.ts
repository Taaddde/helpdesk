import { Component, OnInit} from '@angular/core';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { reasonService } from 'app/shared/services/helpdesk/deposit/reason.service';
import { ReasonComponent } from '../pop-up/reason.component';
import { Reason } from 'app/shared/models/helpdesk/deposit/reason';

@Component({
  selector: 'app-reason-list',
  templateUrl: './list.component.html',
  providers: [userService, reasonService]
})
export class ReasonListComponent implements OnInit {

  public token: string;
  public identity;
  rows = [];
  public columns = [];
  temp = [];

  public canCreate = false;

  constructor(
    private _userService: userService,
    private _reasonService: reasonService,
    private loader: AppLoaderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
  }

  ngOnInit() {
    this.getColumns();
    this.getReasons();

    if(this.identity['role'] == 'ROLE_ADMIN'){
      this.canCreate = true;
    }
  }

  getReasons(){
    let query = {company: this.identity['company']['_id']};
    this._reasonService.getList(this.token, query).subscribe(
      response =>{
          if(response.reasons){
            this.rows = response.reasons;
            this.temp = response.reasons;
          }
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

  getColumns(){
    this.columns = [
      {
        prop: 'name',
        name: 'Nombre',
        flexGrow: 2
      },
      {
        prop: 'type',
        name: 'Tipo',
        flexGrow: 1
      },
    ];
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
    this.openPopUp(true);
  }

  openPopUp(isNew?, reason?){
    let title = isNew ? 'Nuevo motivo' : 'Editar motivo';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ReasonComponent, {
      width: '720px',
      disableClose: false,
      data: { payload: reason, title:title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
          let reason = new Reason('',res.reason['name'], res.reason['type'], this.identity['company']['_id']);
            this._reasonService.add(this.token, reason).subscribe(
                response =>{
                    if(response.reason){
                        this.openSnackBar('Motivo creado', 'Cerrar');
                        this.getReasons();
                    }
                },
                error =>{
                    this.openSnackBar(error.message, 'Cerrar');
                }
            )
          
        } else {

          this._reasonService.edit(this.token, res.reason['_id'], res.reason).subscribe(
            response =>{
              if(response.reason){
                this.openSnackBar('Motivo actualizado', 'Cerrar');
                this.getReasons();
              }
            },
            error =>{
              this.openSnackBar(error.message, 'Cerrar');
            }
          )
        }
        this.loader.close();
      })
  }

  toProfile(event, isNew?) {
    if(event.type != 'click'){
        return;
    }
    if(this.canCreate){
      this.openPopUp(false, event.row);
    }
    
  }

}