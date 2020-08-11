import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
declare var $: any;
import { userService } from 'app/shared/services/api-medint/usuario.service';
import { pacienteService } from 'app/shared/services/api-medint/paciente.service';
// tslint:disable-next-line:no-duplicate-imports
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { Carpeta } from 'app/shared/models/carpeta.model';
import { GLOBAL } from 'app/shared/services/api-medint/global';
@Component({
  selector: 'app-subir-archivo',
  templateUrl: './subir-archivo.component.html',
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    userService
  ],
})
export class SubirArchivoComponent implements OnInit {

    public uploader: FileUploader;
    public hasBaseDropZoneOver: boolean = false;
    console = console;
    public token: string;
    public selected: string;
    public carpeta: Carpeta;

    public fechas: string[];
    public fechasHasta: string[];
    public tipos: string[];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<SubirArchivoComponent>,
        private _userService: userService,
        private snackBar: MatSnackBar

    ){
        this.carpeta = data.payload;
        this.uploader = new FileUploader({
            url: GLOBAL.url+'archivo/add',
            additionalParameter: {
                carpeta: data.payload['_id'],
                paciente: data.payload['paciente']['_id'],
            }
        });

        this.fechas = new Array<string>();
        this.fechasHasta = new Array<string>();
        this.tipos = new Array<string>();

    }

    ngOnInit() {
        this.uploader.onBeforeUploadItem = (item: FileItem) => {
            item.withCredentials = false;
        }
    }

    setDate(value, item: FileItem, typeDate: string){
        if(typeDate == 'desde'){
            item.url = GLOBAL.url+'archivo/add?'+this.takeQuery(
                'FechaDesde', 
                moment(value).format('YYYY-MM-DD'), 
                this.uploader.queue.indexOf(item)
            )
        }else{
            item.url = GLOBAL.url+'archivo/add?'+this.takeQuery(
                'FechaHasta', 
                moment(value).format('YYYY-MM-DD'), 
                this.uploader.queue.indexOf(item)
            )
        }
    }

    setType(value, item: FileItem){
        item.url = GLOBAL.url+'archivo/add?'+this.takeQuery(
                                                   'Tipo', 
                                                   value, 
                                                   this.uploader.queue.indexOf(item)
                                               )
   }


    private takeQuery(type: string, value: string, index: number){
        switch (type) {
            case 'FechaDesde':
                this.fechas[index] = value;
                break;
            case 'FechaHasta':
                this.fechasHasta[index] = value;
                break;
            case 'Tipo':
                this.tipos[index] = value;
                break;
            default:
                break;
        }

        return 'fecha='+this.fechas[index]+'&fechaHasta='+this.fechasHasta[index]+'&tipo='+this.tipos[index];
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
        duration: 10000,
        });
    }

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    submit() {

        //this.dialogRef.close()
    }
}
