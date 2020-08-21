import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { typeTicketService } from 'app/shared/services/helpdesk/typeticket.service';
import { subTypeTicketService } from 'app/shared/services/helpdesk/subtypeticket.service';
import { TypeTicket } from 'app/shared/models/helpdesk/typeticket';
import { SubTypeTicket } from 'app/shared/models/helpdesk/subtypeticket';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { TypePopupComponent } from './type/type-popup.component';

@Component({
  selector: 'app-type-ticket',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css'],
  providers: [userService, typeTicketService, subTypeTicketService]
})
export class TypesTicketComponent implements OnInit {

  public identity;
  public token: string;
  public url: string;

  public types: TypeTicket[];
  public subtypes: Array<SubTypeTicket[]>;
  public newType: TypeTicket;
  public newSubtype: SubTypeTicket;

  constructor(
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private _userService: userService,
    private _typeTicketService: typeTicketService,
    private _subTypeTicketService: subTypeTicketService,
    private confirmService: AppConfirmService,
    private snackBar: MatSnackBar,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
    this.url = GLOBAL.url;

    this.subtypes = new Array<SubTypeTicket[]>();

    this.newType = new TypeTicket('','',this.identity['company']['_id']);
    this.newSubtype = new SubTypeTicket('','','',0,'',String[''],0,false, '','','',null);
  }

  ngOnInit() {
    this.getTypes();
  }

  getTypes(){
    this._typeTicketService.getList(this.token,this.identity['company']['_id']).subscribe(
      response =>{
          if(response.typeTickets){
            this.types = response.typeTickets;
            for (let i = 0; i < this.types.length; i++) {
              const element = this.types[i];
              this.getSubTypes(element._id, i);
            }
          }
      },
      error =>{
          this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  getSubTypes(typeId, index){
    this._subTypeTicketService.getList(this.token, typeId).subscribe(
      response =>{
          if(response.subTypeTickets){
            this.subtypes.push(response.subTypeTickets);
          }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  deleteType(type: TypeTicket){
    this.confirmService.confirm({message: "¿Estas seguro que quieres eliminar el tipo "+type.name+"?"})
      .subscribe(res => {
        if (res) {
          this._typeTicketService.delete(this.token, type._id).subscribe(
            response =>{
                if(response.typeTicket){
                  this.getTypes();
                  this.openSnackBar('Tipo eliminado', 'Cerrar');
                }
            },
            error =>{
              this.openSnackBar(error.message, 'Cerrar');
            }
          );
        }
      })
    
      
    
  }

  addType(name:string){
    let newType = new TypeTicket('',name,this.identity['company']['_id']);
    this._typeTicketService.add(this.token, newType).subscribe(
      response =>{
          if(response.typeTicket){
            this.getTypes();
            this.openSnackBar('Tipo de ticket añadido', 'Cerrar');
          }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  editType(id: string, name: string){
    let editType = new TypeTicket(id,name,this.identity['company']['_id']);
    this._typeTicketService.edit(this.token, id, editType).subscribe(
      response =>{
          if(response.typeTicket){
            this.getTypes();
            this.openSnackBar('Tipo de ticket editado', 'Cerrar');
          }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  openPopUp(type, isNew?) {
    let title = isNew ? 'Nuevo tipo de ticket' : 'Editar tipo de ticket';
    let dialogRef: MatDialogRef<any> = this.dialog.open(TypePopupComponent, {
      width: '500px',
      data: { payload: type, title:title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {

          this.addType(res.type.name);

        } else {

         this.editType(res.type._id, res.type.name);

        }
        this.loader.close();
      })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

}