import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ticket } from 'app/shared/models/helpdesk/ticket';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { ticketService } from 'app/shared/services/helpdesk/ticket.service';
import { userService } from 'app/shared/services/helpdesk/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-ticket-search-popop',
  templateUrl: './ticket-search.component.html',
  providers: [userService, ticketService]
}) 
export class TicketSearchComponent implements OnInit {
  public token: string;
  public identity;
  public url: string = GLOBAL.url;

  public tickets: Ticket[];
  public filter: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TicketSearchComponent>,
    private snackBar: MatSnackBar,
    private _userService: userService,
    private _ticketService: ticketService,
    private loader: AppLoaderService,

  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
   }

  ngOnInit() {
  }

  getTickets(){
    if(this.filter == ''){
      return this.openSnackBar('El campo de busqueda esta vacío', 'Cerrar');
    }
    this.loader.open('Cargando tickets');
    let query = {sub: this.filter, company: this.identity['company']['_id']};
    this._ticketService.getUnpaginateList(this.token, query).subscribe(
      response =>{
        if(response.tickets){
           this.tickets = response.tickets;
           this.loader.close();
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

  changeDate(val:string){
    return moment(val, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm');
  }

  submit(event) {
    if(event.type == 'click'){
      this.dialogRef.close({ticket: event.row})
    }
  }
}
