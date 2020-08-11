import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { NgxTablePopupComponent } from './ngx-table-popup/ngx-table-popup.component';
import { Subscription } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';
import { carpetaService } from 'app/shared/services/api-medint/carpeta.service';
import { userService } from 'app/shared/services/api-medint/usuario.service';
import { Carpeta } from 'app/shared/models/carpeta.model';
import { SubirArchivoComponent } from './ngx-table-popup/subir-archivo.component';
import { VerArchivoComponent } from './ngx-table-popup/ver-archivo.component';
import * as moment from 'moment';
import { Paciente } from 'app/shared/models/paciente.model';
import { FormControl } from '@angular/forms';
import { pacienteService } from 'app/shared/services/api-medint/paciente.service';
import { prestadorService } from 'app/shared/services/api-medint/prestador.service';

@Component({
  selector: 'app-carpeta',
  templateUrl: './carpeta.component.html',
  styleUrls: ['./carpeta.component.css'],
  providers: [carpetaService, userService, pacienteService, prestadorService]
})
export class CarpetaComponent implements OnInit {

  public items: any[];
  public token: string;
  selected = '';
  os = '';
  mes = 'Junio';
  ano ='2020'

  //Pacientes
  public pacientes: Paciente[];
  paciente: string;  

  //Pacientes
  public prestadores: Paciente[];
  prestador: string;

  public query: any;

  public folders: any[];
  public meses: string[];
  public anos: string[];

  public uploader: FileUploader = new FileUploader({ url: 'https://evening-anchorage-315.herokuapp.com/api/' });
  public hasBaseDropZoneOver: boolean = false;
  console = console;


  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private _carpetaService: carpetaService,
    private _userService: userService,
    private _pacienteService: pacienteService,
    private snackBar: MatSnackBar,
    private _prestadorService: prestadorService
  ) {
    this.token = _userService.getToken();
  }

  ngOnInit() {
    this.setQuery();
    this.getFolders();

  }

  setQuery(){
    this.query = {}
    moment.locale('es');

    //Mes
    this.meses  = [
      'Enero','Febrero','Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    let mesActual = moment().format('MMMM');
    let mesCapitalizado = mesActual[0].toUpperCase() + mesActual.slice(1);
    this.query['mes'] = mesCapitalizado;

    //Año
    this.anos = new Array();
    this._carpetaService.countAnos(this.token).subscribe(
      response =>{
        if(response.anos){
          (response.anos).forEach(e => {
            this.anos.push(e._id);
          });
        }else{
          this.openSnackBar('La busqueda no encontró ningun año', 'Cerrar');
        }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    )
    this.query['ano'] = moment().format('YYYY');

    //Paciente
    this.getPacientes();

    //Prestador
    this.getPrestadores();
  }

  search(){
    this.getFolders();
  }

  getPacientes(){
    this._pacienteService.getList(this.token).subscribe(
      response =>{
        if(response.pacientes)  {
          this.pacientes = response.pacientes;
        }
      },
      error =>{
        console.log(error.message)
      });
  }

  getPrestadores(){
    this._prestadorService.getList(this.token).subscribe(
      response =>{
        if(response.prestadores)  {
          this.prestadores = response.prestadores;
        }
      },
      error =>{
        console.log(error.message)
      });
  }

  getFolders(){
    this._carpetaService.getList(this.token, this.query).subscribe(
      response =>{
        if(response.carpetas)  {
          this.folders = response.carpetas;
          for (let i = 0; i < this.folders.length; i++) {
            this.folders[i]['nombre'] = this.folders[i]['paciente']['apellido']+', '+this.folders[i]['paciente']['nombre'];
            this.folders[i]['documentos'] = this.getFileLenght(this.folders[i]['archivos']);
          }
        }else{
          this.openSnackBar('La busqueda no encontró ninguna carpeta', 'Cerrar');
        }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    )
  }

  deleteMes(){
    delete this.query['mes']
  }

  deleteAno(){
    delete this.query['ano']
  }

  deletePaciente(){
    delete this.query['paciente']
  }

  deletePrestador(){
    delete this.query['prestador'];
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  public fileOverBase(e: any): void {
    console.log(e)
  }

  openPopUp(folder: Carpeta, isNew?) {
    let title = isNew ? 'Nueva carpeta' : 'Editar carpeta';
    let dialogRef: MatDialogRef<any> = this.dialog.open(NgxTablePopupComponent, {
      width: '720px',
      disableClose: true,
      data: { payload: folder, title:title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
          this._carpetaService.add(this.token, res).subscribe(
            response =>{
              if(response.carpeta)  {
                this.getFolders();
                this.openSnackBar('Carpeta añadida', 'Cerrar');
              }else{
                this.openSnackBar('No se pudo añadir la carpeta', 'Cerrar');
              }
            },
            error =>{
              this.openSnackBar(error.message, 'Cerrar');
            }
          )
        } else {
          this._carpetaService.edit(this.token, res).subscribe(
            response =>{
              if(response.carpeta)  {
                this.getFolders();
                this.openSnackBar('Carpeta editada', 'Cerrar');
              }else{
                this.openSnackBar('No se pudo editar la carpeta', 'Cerrar');
              }
            },
            error =>{
              this.openSnackBar(error.message, 'Cerrar');
            }
          )
        }
        this.loader.close();
      })
  }

  openPopUpSubirArchivo(folder: Carpeta) {
    let title = 'Subir archivo';
    let dialogRef: MatDialogRef<any> = this.dialog.open(SubirArchivoComponent, {
      maxWidth: '90%',
      maxHeight: '100vh',
      disableClose: true,
      data: { payload: folder, title:title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        this.loader.open();
        this.getFolders();
        this.loader.close();
      })
  }

  openPopUpVerArchivo(folder: Carpeta) {
    let title = 'Ver archivos';
    let dialogRef: MatDialogRef<any> = this.dialog.open(VerArchivoComponent, {
      width: '90%',
      maxHeight: '80vh',
      disableClose: true,
      data: { payload: folder, title:title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        this.loader.open();
        this.getFolders();
        this.loader.close();
      })
  }

  deleteItem(row: Carpeta) {
    this.confirmService.confirm({message: `¿Eliminar ${row['nombre']} de ${row.mes}/${row.ano}?`})
      .subscribe(res => {
        if (res) {
          this._carpetaService.delete(this.token, row._id ).subscribe(
            response =>{
              if(response.carpeta)  {
                this.getFolders();
                this.openSnackBar('Carpeta eliminada', 'Cerrar');
              }else{
                this.openSnackBar('No se pudo eliminar la carpeta', 'Cerrar');
              }
            },
            error =>{
              this.openSnackBar(error.message, 'Cerrar');
            }
          )
        }
      })
  }

  getFileLenght(files: string[]){
    if(files && files.length){
      return files.length;
    }else{
      return 0;
    }
  }
}