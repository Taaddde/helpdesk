import { Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { sectorService } from 'app/shared/services/helpdesk/sector.service';
import { Sector } from 'app/shared/models/helpdesk/sector';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SectorComponent } from '../sector/sector.component';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-sector-list',
  templateUrl: './list.component.html',
  providers: [userService, sectorService]
})
export class SectorListComponent implements OnInit {

  public token: string;
  public identity;
  rows = [];
  public columns = [];
  temp = [];

  public canCreate = false;

  constructor(
    private _userService: userService,
    private _sectorService: sectorService,
    private _route: ActivatedRoute,
    private _router: Router,
    private loader: AppLoaderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
  }

  ngOnInit() {
    this.getColumns();
    this.getSectors();

    if(this.identity['role'] == 'ROLE_ADMIN'){
      this.canCreate = true;
    }
  }

  getSectors(){
    this._sectorService.getList(this.token).subscribe(
      response =>{
          if(response.sectors){
            this.rows = response.sectors;
            this.temp = response.sectors;
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
        prop: 'initials',
        name: 'Iniciales',
        flexGrow: 1
      },
      {
        prop: 'email',
        name: 'Email',
        flexGrow: 2
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

  openPopUp(isNew?, sector?){
    let title = isNew ? 'Nuevo sector' : 'Editar sector';
    let dialogRef: MatDialogRef<any> = this.dialog.open(SectorComponent, {
      width: '720px',
      disableClose: false,
      data: { payload: sector, title:title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
            this._sectorService.add(this.token, res.sector).subscribe(
                response =>{
                    if(response.sector){
                        this.openSnackBar('Sector creado', 'Cerrar');
                        this.getSectors();
                    }
                },
                error =>{
                    this.openSnackBar(error.message, 'Cerrar');
                }
            )
          
        } else {

          this._sectorService.edit(this.token, res.sector['_id'], res.sector).subscribe(
            response =>{
              if(response.sector){
                this.openSnackBar('Sector actualizado', 'Cerrar');
                this.getSectors();
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
    this.openPopUp(false, event.row);
    
  }

}