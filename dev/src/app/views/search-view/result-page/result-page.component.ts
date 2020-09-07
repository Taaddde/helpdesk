import { Component, OnInit, OnDestroy } from "@angular/core";
import { SearchService } from "app/shared/search/search.service";
import { Observable, Subscription } from "rxjs";
import { CountryService } from "../country.service";
import { ticketService } from "app/shared/services/helpdesk/ticket.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Ticket } from "app/shared/models/helpdesk/ticket";
import { userService } from "app/shared/services/helpdesk/user.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { GLOBAL } from "app/shared/services/helpdesk/global";
import * as moment from 'moment';
import { Router } from "@angular/router";

@Component({
  selector: "app-result-page",
  templateUrl: "./result-page.component.html",
  styleUrls: ["./result-page.component.scss"],
  providers: [userService]
})
export class ResultPageComponent implements OnInit, OnDestroy {
  countries$: Observable<any[]>;
  searchTermSub: Subscription;

  tickets: Ticket[];

  public token: string;
  public identity;
  public url: string = GLOBAL.url;

  constructor(
    public searchService: SearchService,
    public countryService: CountryService,
    private _ticketService: ticketService,
    private snackBar: MatSnackBar,
    private _userService: userService,
    private _router: Router,
    private loader: AppLoaderService,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
  }

  ngOnInit() {
    this.searchTermSub = this.searchService.searchTerm$.subscribe(term => {
      let query = {sub: term, company: this.identity['company']['_id']};
      if(term.length >= 3){
        this.loader.open('Cargando tickets');
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
    });
  }

  changeDate(val:string){
    return moment(val, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  ngOnDestroy() {
    if (this.searchTermSub) {
      this.searchTermSub.unsubscribe();
    }
  }

  goToTicket(event){
    if(event.type == 'click'){
      this._router.navigate(['/ticket/gestion', event.row._id]);
    }
  }
  
}
