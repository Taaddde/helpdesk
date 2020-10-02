import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

import { MatInputModule } from '@angular/material/input';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatIconModule } from '@angular/material/icon';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
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
import { ItemRoutes } from './item.routing';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { DragulaModule } from 'ng2-dragula';


import { ItemListComponent } from './list/list.component';
import { ItemComponent } from './pop-up/item.component';
import { EnableItemComponent } from './enable/enable.component';
import { StockListComponent } from './stockmin/list.component';
import { StockMinComponent } from './stockmin/stockmin.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatDividerModule,
    MatSelectModule,
    SharedModule,
    MatListModule,
    MatTooltipModule,
    MatIconModule,
    DragulaModule,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatInputModule,
    FlexLayoutModule,
    NgxDatatableModule,
    SharedPipesModule,
    RouterModule.forChild(ItemRoutes)
  ],
  declarations: [ItemListComponent, ItemComponent, EnableItemComponent, StockListComponent, StockMinComponent],
  entryComponents: [ItemComponent, StockMinComponent]
})
export class AppItemModule { }