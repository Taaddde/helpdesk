import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

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
import {MatFormFieldModule} from '@angular/material/form-field';
import { FileUploadModule } from 'ng2-file-upload';
import {MatSelectModule} from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';





import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';


import { UserRoutes } from './user.routing';
import { UserProfileComponent } from './profile/profile.component';
import { RequesterListComponent } from './list/requester-list.component';
import { AgentListComponent } from './list/agent-list.component';
import { TeamListComponent } from './list/team-list.component';
import { TeamProfileComponent } from './team/team.component';
import { NewUserComponent } from './profile/new.component';
import { NewTeamComponent } from './team/new.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    MatFormFieldModule,
    FormsModule,
    MatDividerModule,
    MatSortModule,
    MatSelectModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatTableModule,
    SharedModule,
    MatListModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatChipsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatInputModule,
    MatProgressBarModule,
    FlexLayoutModule,
    NgxDatatableModule,
    ChartsModule,
    FileUploadModule,
    SharedPipesModule,
    RouterModule.forChild(UserRoutes)
  ],
  declarations: [UserProfileComponent, RequesterListComponent, AgentListComponent, TeamListComponent, TeamProfileComponent, NewUserComponent, NewTeamComponent],
  entryComponents: []
})
export class AppUserModule { }