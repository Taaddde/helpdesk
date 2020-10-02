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
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { QuillModule } from 'ngx-quill';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';



import { OrderRoutes } from './order.routing';
import { NewOrderComponent } from './new/new-order.component';
import { OrderDetailComponent } from './new/order.component';




@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MaterialFileInputModule,
    QuillModule,
    MatStepperModule,
    FormsModule,
    NgxDatatableModule,
    MatDividerModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSelectModule,
    SharedModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatInputModule,
    FlexLayoutModule,
    RouterModule.forChild(OrderRoutes)
  ], 
  declarations: [NewOrderComponent, OrderDetailComponent],
  entryComponents: []
})
export class AppOrderModule { }