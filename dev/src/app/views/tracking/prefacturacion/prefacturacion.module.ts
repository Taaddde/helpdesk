import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CrudService } from './crud.service';
import { NgxTablePopupComponent } from './carpeta/ngx-table-popup/ngx-table-popup.component'
import { SubirArchivoComponent } from './carpeta/ngx-table-popup/subir-archivo.component'
import { TranslateModule } from '@ngx-translate/core';
import { PrefacturacionRoutes } from './prefacturacion.routing';
import { CarpetaComponent } from './carpeta/carpeta.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FileUploadModule } from 'ng2-file-upload';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VerArchivoComponent } from './carpeta/ngx-table-popup/ver-archivo.component'
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component'


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxDatatableModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatChipsModule,
    MatCheckboxModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatSelectModule,
    TranslateModule,
    MatDatepickerModule,
    SharedModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    FileUploadModule,
    MatProgressBarModule,
    PdfViewerModule,
    RouterModule.forChild(PrefacturacionRoutes)
  ],
  declarations: [CarpetaComponent, NgxTablePopupComponent, SubirArchivoComponent, VerArchivoComponent, PdfViewerComponent],
  providers: [CrudService],
  entryComponents: [NgxTablePopupComponent]
})
export class AppPrefacturacionModule { }