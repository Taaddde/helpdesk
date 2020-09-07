import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SearchViewRoutingModule } from "./search-view-routing.module";
import { ResultPageComponent } from "./result-page/result-page.component";
import { MatCardModule } from "@angular/material/card";
import { SearchModule } from "app/shared/search/search.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ticketService } from "app/shared/services/helpdesk/ticket.service";

@NgModule({
  declarations: [ResultPageComponent],
  imports: [MatCardModule, CommonModule, NgxDatatableModule, SearchViewRoutingModule],
  providers: [ticketService]
})
export class SearchViewModule {}
