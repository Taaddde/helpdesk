import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {MatIconModule} from '@angular/material/icon';

import { TrackingRoutes } from './tracking.routing';
import { TrackingListComponent } from './list/tracking-list.component';
import {MatButtonModule} from '@angular/material/button';
import { RequestPopUpComponent } from './list/request-popup.component';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { TrackingAnalyticsComponent } from './analytics/analytics.component';
import { MatTabsModule } from '@angular/material/tabs';



import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FileUploadModule } from 'ng2-file-upload';
import { TrackingImportComponent } from './import/import.component';
import { TrackingErrorsComponent } from './import/errors/errors.component';







import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';








@NgModule({
  imports: [

    ReactiveFormsModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatTooltipModule,
    SharedModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatChipsModule,
    FileUploadModule,
    MatFormFieldModule,
    MatExpansionModule,
    SharedPipesModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatListModule,
    MatMenuModule,
    NgxEchartsModule,
    FlexLayoutModule,
    ChartsModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgxDatatableModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
    RouterModule.forChild(TrackingRoutes)
  ],
  declarations: [TrackingListComponent, TrackingErrorsComponent, RequestPopUpComponent, TrackingAnalyticsComponent, TrackingImportComponent],
  entryComponents: [TrackingErrorsComponent]
})
export class AppTrackingModule { }