import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';




import { MovimRoutes } from './movim.routing';
import { NewMovimComponent } from './new/new-movim.component';
import { TicketSearchComponent } from './new/search-ticket/ticket-search.component';
import { MovimListComponent } from './list/list.component';
import { MovimPopUpComponent } from './list/pop-up.component';





@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatRadioModule,
    FormsModule,
    MatDividerModule,
    MatSortModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    SharedModule,
    MatListModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTabsModule,
    MatInputModule,
    FlexLayoutModule,
    NgxDatatableModule,
    SharedPipesModule,
    RouterModule.forChild(MovimRoutes)
  ],
  declarations: [NewMovimComponent, TicketSearchComponent, MovimListComponent, MovimPopUpComponent],
  entryComponents: [TicketSearchComponent, MovimPopUpComponent]
})
export class AppMovimModule { }