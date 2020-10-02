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
import { SettingsRoutes } from './settings.routing';
import { QuillModule } from 'ngx-quill';
import {DragDropModule} from '@angular/cdk/drag-drop';






import { SectorListComponent } from './list/sector-list.component';
import { SectorComponent } from './sector/sector.component';
import { CompanyProfileComponent } from './company/company.component';
import { TypesTicketComponent } from './type-subtype tickets/type.component';
import {  SubTypeEditComponent } from './type-subtype tickets/subtype/subtype-edit.component';
import { SubTypeNewComponent } from './type-subtype tickets/subtype/subtype-new.component';
import { TypePopupComponent } from './type-subtype tickets/type/type-popup.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    QuillModule,
    FormsModule,
    MatDividerModule,
    MatSortModule,
    MatExpansionModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    SharedModule,
    DragDropModule,
    MatListModule,
    MatTooltipModule,
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
    RouterModule.forChild(SettingsRoutes)
  ],
  declarations: [SectorListComponent, SectorComponent, TypePopupComponent, CompanyProfileComponent, TypesTicketComponent, SubTypeEditComponent, SubTypeNewComponent],
  entryComponents: []
})
export class AppSettingsModule { }