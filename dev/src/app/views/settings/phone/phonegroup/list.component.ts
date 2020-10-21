import { Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Phone } from 'app/shared/models/helpdesk/phone';
import { PhoneGroup } from 'app/shared/models/helpdesk/phonegroup';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { phonegroupService } from 'app/shared/services/helpdesk/phonegroup.service';
import { PhoneGroupComponent } from './pop-up.component';

@Component({
  selector: 'app-deposit-list',
  templateUrl: './list.component.html',
  providers: [phonegroupService]
})
export class PhoneGroupListComponent implements OnInit {

  public token: string;
  public identity;
  rows = [];
  public columns = [];
  temp = [];

  public canCreate = false;

  public groupId;

  constructor(
    private _phonegroupService: phonegroupService,
    private _route: ActivatedRoute,
    private _router: Router,
    private loader: AppLoaderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getColumns();
    this.getPhones();
  }

  getPhones(){
    this._phonegroupService.getList({}).subscribe(
      response =>{
        if(response.phoneGroups){
          this.rows = response.phoneGroups;
          this.temp = response.phoneGroups;
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
        prop: 'branch',
        name: 'Centro',
        flexGrow: 1
      }
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

  openPopUp(isNew?, phoneGroup?){
    let title = isNew ? 'Nuevo grupo' : 'Editar grupo';
    let dialogRef: MatDialogRef<any> = this.dialog.open(PhoneGroupComponent, {
      width: '720px',
      disableClose: false,
      data: { payload: phoneGroup, title:title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) 
          return;

        this.loader.open();
        if (isNew) {
          let phoneGroup = new PhoneGroup('',res.phoneGroup.name, res.phoneGroup.branch);
            this._phonegroupService.add(phoneGroup).subscribe(
                response =>{
                    if(response.phoneGroup){
                        this.openSnackBar('Teléfono creado', 'Cerrar');
                        this.getPhones();
                    }
                },
                error =>{
                    this.openSnackBar(error.message, 'Cerrar');
                }
            )
          
        } else {

          if(res.delete){
            this._phonegroupService.delete(res.phoneGroup._id).subscribe(
                response =>{
                  if(response.phoneGroup){
                    this.openSnackBar('Teléfono eliminado', 'Cerrar');
                    this.getPhones();
                  }
                },
                error =>{
                  this.openSnackBar(error.message, 'Cerrar');
                }
            );
          }else{
            this._phonegroupService.edit(res.phoneGroup['_id'], res.phoneGroup).subscribe(
              response =>{
                if(response.phoneGroup){
                  this.openSnackBar('Teléfono actualizado', 'Cerrar');
                  this.getPhones();
                }
              },
              error =>{
                this.openSnackBar(error.message, 'Cerrar');
              }
            )
          }

         
        }
        this.loader.close();
      })
  }

  toProfile(event, isNew?) {
    if(event.type == 'click'){
      this._router.navigate(['/settings/list/phone/', event.row._id])
    }
    // if(this.canCreate){
    //   this.openPopUp(false, event.row);
    // }
  }

}