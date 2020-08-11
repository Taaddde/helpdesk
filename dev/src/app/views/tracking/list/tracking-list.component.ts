import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import * as moment from 'moment';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { Request } from 'app/shared/models/helpdesk/request';
import { Params, ActivatedRoute } from '@angular/router';
import { requestService } from 'app/shared/services/helpdesk/request.service';
import * as XLSX from 'xlsx'; 
import { RequestPopUpComponent } from './request-popup.component';


@Component({
  selector: 'app-tracking-list',
  templateUrl: './tracking-list.component.html',
  styleUrls: ['./tracking-list.component.css'],
  providers: [userService, requestService]
})
export class TrackingListComponent implements OnInit {

  public token: string;
  public query: any;
  rows = [];
  columns = [];
  temp = [];

  public requests_excel: Request[];
  public fileName = 'Reporte.xlsx'

  constructor(
    private dialog: MatDialog,
    private _route: ActivatedRoute,
    private snack: MatSnackBar,
    private loader: AppLoaderService,
    private snackBar: MatSnackBar,
    private _userService: userService,
    private _requestService: requestService
  ) {
    this.token = _userService.getToken();
  }

  ngOnInit() {
    this.columns = this.getColumns();
    this.setQuery();
    this.getRequests();
  }

  setQuery(){
    this.query = {}
  }

  search(){
    this.getRequests();
  }

  getColumns(){
    return [
      {
        prop: 'num',
        name: '#',
        flexGrow: 1
      },
      {
        prop: 'req',
        name: 'Requerimiento',
        flexGrow: 3
      },
      {
        prop: 'module',
        name: 'Módulo',
        flexGrow: 2
      },
      {
        prop: 'statusClient',
        name: 'Estado cliente',
        flexGrow: 1

      },
      {
        prop: 'statusEnterprise',
        name: 'Estado TS',
        flexGrow: 1

      },
      {
        prop: 'environment',
        name: 'Entorno',
        flexGrow: 1

      },
      { 
        prop: 'obs',
        name: 'Info', 
        flexGrow: 3,
      },
    ];

  }

  getRequests(){
    this._route.queryParams.forEach((query: Params) =>{
        this.query = query;
        
          this._requestService.getList(this.token, query).subscribe(
            response =>{
                if(response.requests){
                  this.requests_excel = response.requests;
                  this.rows = response.requests;
                  this.temp = response.requests;
                }
            },
            error =>{
                console.error(error);
            }
        );
      })
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  public fileOverBase(e: any): void {
    console.log(e)
  }

  openPopUp(event) {

    if(event.type != 'click'){
      return
    }

    let req: Request = event.row;
    let title = 'Requerimiento #' + req.num;
    let dialogRef: MatDialogRef<any> = this.dialog.open(RequestPopUpComponent, {
      width: '720px',
      disableClose: false,
      data: { payload: req, title:title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        this.getRequests();
        this.loader.close();
      })
  }

  exportExcel(): void 
    {
      /* table id is passed over here */   
      let element = document.getElementById('export-excel'); 
      const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

      var wscols = [
        {wch:5},
        {wch:60},
        {wch:70},
        {wch:20},
        {wch:20},
        {wch:15},
        {wch:5},
        {wch:5},
        {wch:20},
        {wch:10},
        {wch:50},



      ];
    
        ws['!cols'] = wscols;

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
			
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


}