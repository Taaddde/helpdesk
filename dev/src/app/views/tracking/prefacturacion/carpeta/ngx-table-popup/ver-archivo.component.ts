import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
declare var $: any;
import { userService } from 'app/shared/services/api-medint/usuario.service';
import { Carpeta } from 'app/shared/models/carpeta.model';
// tslint:disable-next-line:no-duplicate-imports
import { MatSnackBar } from '@angular/material/snack-bar';
import { Archivo } from 'app/shared/models/archivo.model';
import { carpetaService } from 'app/shared/services/api-medint/carpeta.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { PdfViewerComponent } from 'app/views/pdf-viewer/pdf-viewer.component';
import { GLOBAL } from 'app/shared/services/api-medint/global';
import { archivoService } from 'app/shared/services/api-medint/archivo.service';

@Component({
  selector: 'app-ver-archivo',
  templateUrl: './ver-archivo.component.html',
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    userService, carpetaService, archivoService
  ],
})
export class VerArchivoComponent implements OnInit {

    public token: string;
    public carpeta: Carpeta;
    public archivos: Archivo[];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<VerArchivoComponent>,
        private snack: MatSnackBar,
        private confirmService: AppConfirmService,
        private loader: AppLoaderService,
        private _carpetaService: carpetaService,
        private _userService: userService,
        private _archivoService: archivoService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
    
    ){
        this.token = _userService.getToken();
        this.carpeta = data.payload;
    }

    ngOnInit() {
        this.getFiles(this.carpeta);
    }


    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 10000,
        });
    }

    openSnackBarViewer(message: string, action: string, url: string) {
        this.snackBar.open(message, action, {
            duration: 10000,
        });

        this.snackBar._openedSnackBarRef.onAction().subscribe(
            () => {
                let routerFile = 'archivo/file/'
                window.open(GLOBAL.url+routerFile+url, "_blank");
            }
        );
    }

    getFiles(carpeta: Carpeta){
        this._carpetaService.getOne(this.token, carpeta._id).subscribe(
            response =>{
              if(response.carpeta)  {
                    this.archivos = response.carpeta['archivos'];
              }else{
                this.openSnackBar('La busqueda no encontró ninguna carpeta', 'Cerrar');
              }
            },
            error =>{
              this.openSnackBar(error.message, 'Cerrar');
            }
          )
    }

    private checkExt(url){
        let data: string = url;
        let ext = data.split('\.')[1];

        if(ext != 'pdf'){
            return false;
        }

        return true;
    }

    openViewer(archivo: Archivo) {
        if(this.checkExt(archivo.archivo)){
            let title = archivo.nombre;
            let dialogRef: MatDialogRef<any> = this.dialog.open(PdfViewerComponent, {
              width: '100%',
              maxHeight: '100vh',
              disableClose: false,
              data: { url: archivo.archivo, title:title }
            })
        }else{
            return this.openSnackBarViewer(
                        'El archivo no tiene la extensión pdf, el visualizador no puede procesarlo', 
                        'Abrir en una ventana aparte', 
                        archivo.archivo
                    )
        }
    }
    
    deleteFile(archivo: Archivo){
        this.confirmService.confirm({message: `¿Eliminar ${archivo.nombre} del paciente ${this.carpeta.paciente['nombre']} ${this.carpeta.paciente['apellido']} - ${this.carpeta.mes}/${this.carpeta.ano}?`})
        .subscribe(res => {
          if (res) {
            this._archivoService.deleteFromFolder(this.token,archivo._id, this.carpeta._id).subscribe(
              response =>{
                if(response.carpeta)  {
                  this.getFiles(this.carpeta);
                  this.openSnackBar('Archivo eliminado', 'Cerrar');
                }else{
                  this.openSnackBar('No se pudo eliminar el archivo', 'Cerrar');
                }
              },
              error =>{
                this.openSnackBar(error.message, 'Cerrar');
              }
            )
          }
        })
    }
    
    changeDate(value){
        return moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY');
    }

    submit() {

        //this.dialogRef.close()
    }
}
