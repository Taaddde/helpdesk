import { Component, OnInit } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
  import { userService } from "app/shared/services/helpdesk/user.service";
  import { requestService } from "app/shared/services/helpdesk/request.service";
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TrackingErrorsComponent } from './errors/errors.component';

  interface error {
    line?: string;
    column?: string;
  }

  
  @Component({
    selector: "app-tracking-import",
    templateUrl: "./import.component.html",
    providers: [userService, requestService],
  })
  export class TrackingImportComponent implements OnInit {
    public token: string;

    public uploader: FileUploader;
    public hasBaseDropZoneOver: boolean = false;
    console = console;

    public errors: error[] = [];
  
    constructor(
      private dialog: MatDialog,
      private snackBar: MatSnackBar
    ) {

      this.uploader = new FileUploader({
        url: GLOBAL.url+'request/import',
      });
    }
  
    ngOnInit() {
      this.uploader.onBeforeUploadItem = (item: FileItem) => {
        item.withCredentials = false;
      }

      this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(response);
      this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem();
    }

    onErrorItem(response){
      let data = JSON.parse(response);
      this.openSnackBarError(data.message, 'Mostrar errores', data.error);
    }

    onSuccessItem(){
      this.openSnackBar('Archivo subido correctamente, en unos instantes, los datos se importarán al sistema', 'Cerrar')
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
        duration: 10000,
        });
    }

  openSnackBarError(message: string, action: string, errors: error[]) {
      this.snackBar.open(message, action, {
          duration: 10000,
      });

      this.snackBar._openedSnackBarRef.onAction().subscribe(
          () => {
            this.openPopUpShowErrors(errors);
          }
      );
  }

  openPopUpShowErrors(errors: error[]) {
    let title = 'Errores';
    let dialogRef: MatDialogRef<any> = this.dialog.open(TrackingErrorsComponent, {
      width: '60%',
      maxHeight: '80vh',
      disableClose: false,
      data: { payload: errors, title:title }
    })
  }

    public fileOverBase(e: any): void {
      this.hasBaseDropZoneOver = e;
    }
 
}