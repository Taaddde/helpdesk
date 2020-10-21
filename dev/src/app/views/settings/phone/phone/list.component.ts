import { Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { Phone } from 'app/shared/models/helpdesk/phone';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { phoneService } from 'app/shared/services/helpdesk/phone.service';
import { PhoneComponent } from './pop-up.component';

@Component({
  selector: 'app-deposit-list',
  templateUrl: './list.component.html',
  providers: [phoneService]
})
export class PhoneListComponent implements OnInit {

  public token: string;
  public identity;
  rows = [];
  public columns = [];
  temp = [];

  public canCreate = false;

  public groupId;

  constructor(
    private _phoneService: phoneService,
    private _route: ActivatedRoute,
    private loader: AppLoaderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getColumns();
    this.getPhones();
  }

  getPhones(){
    this._route.params.forEach((params: Params) =>{
      this.groupId = params['id'];
      let query = {phoneGroup: params['id']};
      this._phoneService.getList(query).subscribe(
        response =>{
          if(response.phones){
            this.rows = response.phones;
            this.temp = response.phones;
          }
        },
        error =>{
            this.openSnackBar(error.message, 'Cerrar');
        }
      );
    })
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
        prop: 'phone',
        name: 'Número',
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

  openPopUp(isNew?, phone?){
    let title = isNew ? 'Nuevo teléfono' : 'Editar teléfono';
    let dialogRef: MatDialogRef<any> = this.dialog.open(PhoneComponent, {
      width: '720px',
      disableClose: false,
      data: { payload: phone, title:title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) 
          return;

        this.loader.open();
        if (isNew) {
          let phone = new Phone('',res.phone.name, this.groupId, res.phone.phone, 2);
            this._phoneService.add(phone).subscribe(
                response =>{
                    if(response.phone){
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
            this._phoneService.delete(phone._id).subscribe(
                response =>{
                  if(response.phone){
                    this.openSnackBar('Teléfono eliminado', 'Cerrar');
                    this.getPhones();
                  }
                },
                error =>{
                  this.openSnackBar(error.message, 'Cerrar');
                }
            );
          }else{
            this._phoneService.edit(res.phone['_id'], res.phone).subscribe(
              response =>{
                if(response.phone){
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
    if(event.type != 'click'){
        return;
    }
    this.openPopUp(false, event.row);
  }

}