import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialFileInputModule } from 'ngx-material-file-input';

import { TodoRoutingModule } from "./todo-routing.module";
import { TodoComponent } from "./todo/todo.component";
import { TodoListComponent } from "./todo-list/todo-list.component";
import { TodoDetailsComponent } from "./todo-details/todo-details.component";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TodoSearchPipe } from './todo-search.pipe';
import { TagDialogueComponent } from './tag-dialogue/tag-dialogue.component';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { todoService } from 'app/shared/services/helpdesk/todo.service';
import { tagService } from 'app/shared/services/helpdesk/tag.service';
import { MatSelectModule } from '@angular/material/select';
import { teamService } from 'app/shared/services/helpdesk/team.service';

@NgModule({
  declarations: [TodoComponent, TodoListComponent, TodoDetailsComponent, TodoSearchPipe, TagDialogueComponent],
  imports: [
    CommonModule, 
    TodoRoutingModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    MatMenuModule,
    MatButtonModule,
    MaterialFileInputModule,
    MatFormFieldModule,
    MatDividerModule,
    DragDropModule,
    FlexLayoutModule,
    MatRippleModule,
    MatToolbarModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule,
    PerfectScrollbarModule
  ],
  entryComponents: [TagDialogueComponent],
  providers: [userService, todoService, tagService, teamService]
})
export class TodoModule {}
