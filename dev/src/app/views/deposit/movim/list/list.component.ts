import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { userService } from "app/shared/services/helpdesk/user.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { GLOBAL } from "app/shared/services/helpdesk/global";
import * as moment from 'moment';
import { Router } from "@angular/router";
import { movimService } from "app/shared/services/helpdesk/deposit/movim.service";
import { Movim } from "app/shared/models/helpdesk/deposit/movim";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MovimPopUpComponent } from "./pop-up.component";

@Component({
  selector: "app-list-movim",
  templateUrl: "./list.component.html",
  providers: [userService, movimService]
})
export class MovimListComponent implements OnInit {
  public rows: Movim[];
  public temp: Movim[];

  public token: string;
  public identity;
  public url: string = GLOBAL.url;

  constructor(
    private snackBar: MatSnackBar,
    private _userService: userService,
    private _movimService: movimService,
    private _router: Router,
    private loader: AppLoaderService,
    private dialog: MatDialog,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
  }

  ngOnInit() {
    this.loader.open('Cargando movimientos');
    let query = {};
    this._movimService.getList(this.token, query).subscribe(
      response =>{
        if(response.movims){
            this.rows = response.movims;
            this.temp = response.movims;

            for (let index = 0; index < this.rows.length; index++) {
              const e = this.rows[index];
              e['art'] = e.item['name']+e.item['brand'];
              this.temp[index]['art'] = e.item['name']+e.item['brand'];
            }
            

            this.loader.close();
        }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  changeDate(val:string){
    return moment(val).format('DD-MM-YYYY HH:mm');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  goToMovim(event){
    if(event.type == 'click'){
      let movim: Movim = event.row
      
      let title = 'Movimiento #' + movim.numMovim;
        let dialogRef: MatDialogRef<any> = this.dialog.open(MovimPopUpComponent, {
          width: '720px',
          disableClose: false,
          data: { payload: movim, title:title }
        })
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    var columns = Object.keys(this.temp[0]);
    // Removes last "$$index" from "column"
    columns.splice(columns.length - 1);

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
  
}
