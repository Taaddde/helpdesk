import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../shared/shared.module';
import { TicketRoutes } from './ticket.routing';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import { QuillModule } from 'ngx-quill';
import { MatStepperModule } from '@angular/material/stepper';
import {MatCheckboxModule} from '@angular/material/checkbox';

//Componentes

import { TicketListComponent } from '../ticket/list/ticket-list.component';
import { TicketGestionComponent } from './gestion/gestion.component';
import { ChatboxComponent } from './gestion/chatbox/chatbox.component';
import { FilterComponent } from './list/filtro/filter.component';
import { NewTicketComponent } from './new/new-ticket.component';
import { ticketService } from 'app/shared/services/helpdesk/ticket.service';
import { userService } from 'app/shared/services/helpdesk/user.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatStepperModule,
    MatSelectModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTooltipModule,
    QuillModule,
    MatGridListModule,
    SharedModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    RouterModule.forChild(TicketRoutes)
  ],
  declarations: [TicketListComponent, TicketGestionComponent, ChatboxComponent, FilterComponent, NewTicketComponent],
  entryComponents: [],
  providers: [ticketService, userService]

})
export class TicketModule { }