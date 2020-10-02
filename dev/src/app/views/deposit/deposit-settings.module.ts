import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { DepositSettingsRoutes } from './deposit-settings.routing';
import { DepositAnalyticsComponent } from './home/analytics.component';
import { OrderItemPopUpComponent } from './order/new/item/pop-up.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatGridListModule,
    FlexLayoutModule,
    ChartsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    SharedPipesModule,
    RouterModule.forChild(DepositSettingsRoutes)
  ],
  declarations: [DepositAnalyticsComponent, OrderItemPopUpComponent],
  entryComponents: [OrderItemPopUpComponent]
})
export class AppDepositSettingsModule { }