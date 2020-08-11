import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl } from '@angular/forms';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
declare var $: any;
import { userService } from 'app/shared/services/api-medint/usuario.service';
import { pacienteService } from 'app/shared/services/api-medint/paciente.service';
import { prestadorService } from 'app/shared/services/api-medint/prestador.service';
import { Carpeta } from 'app/shared/models/carpeta.model';
import {Paciente} from 'app/shared/models/paciente.model'
import { Prestador } from 'app/shared/models/prestador.model';
// tslint:disable-next-line:no-duplicate-imports
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './ngx-table-popup.component.html',
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    userService, pacienteService, prestadorService
  ],
})
export class NgxTablePopupComponent implements OnInit {

  //Pacientes
  controlPacientes = new FormControl();
  public pacientes: Paciente[];
  pacientesFiltrados: Paciente[];
  paciente: string;

  //Meses
  controlMes = new FormControl();
  public meses: string[];
  mesesFiltrados: string[];
  mes: string;

  //Prestadores
  controlPrestador = new FormControl();
  public prestadores: Prestador[];
  prestadoresFiltrados: Prestador[];
  prestador: string;
  

  public vigenciaDesde;
  public vigenciaHasta;
  public token: string;
  public carpeta : Carpeta;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NgxTablePopupComponent>,
    private _pacienteService: pacienteService,
    private _prestadorService: prestadorService,
    private _userService: userService,
    private snackBar: MatSnackBar

  ) {
    this.token = _userService.getToken();
   }

  ngOnInit() {
    this.getPrestador();
    this.getPacientes();
    this.getMeses();

    this.buildFolder(this.data.payload)
  }


  buildFolder(folder){
    if(folder){
      this.carpeta = folder;
      this.paciente = this.carpeta.paciente['nombre']+' '+this.carpeta.paciente['apellido'];
      this.prestador = this.carpeta.prestador['nombre']
    }else{
      this.carpeta = new Carpeta('','','','','',[],[],[],'','','No prefacturado')
      this.carpeta.ano = moment().format('YYYY').toString();

      moment.locale('es');
      let mesActual = moment().format('MMMM');
      let mesCapitalizado = mesActual[0].toUpperCase() + mesActual.slice(1);
      this.carpeta.mes = mesCapitalizado;
  
      delete this.carpeta.insumos;
      delete this.carpeta.sesiones;
      delete this.carpeta.archivos;  
    }
  }

  getPacientes(){
    this._pacienteService.getList(this.token).subscribe(
      response =>{
        if(response.pacientes)  {
          this.pacientes = response.pacientes;
          this.pacientesFiltrados = response.pacientes;
        }
      },
      error =>{
        console.log(error.message)
      });
  }

  getPrestador(){
    this._prestadorService.getList(this.token).subscribe(
      response =>{
        if(response.prestadores)  {
          this.prestadores = response.prestadores;
          this.prestadoresFiltrados = response.prestadores;
        }
      },
      error =>{
        console.log(error.message)
      });
  }

  getMeses(){
    this.meses = [
      'Enero','Febrero','Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    this.mesesFiltrados = [
      'Enero','Febrero','Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
  }

  public filtrado(value: string, list: string){
    value = value.toLowerCase();
    switch (list) {
      case 'pacientes':
        this.pacientesFiltrados = this.pacientes.filter(
          option => {
            return (option.nombre+option.apellido).toLowerCase().includes(value)
          })
        break;
        case 'prestadores':
        this.prestadoresFiltrados = this.prestadores.filter(
          option => {
            return option.nombre.toLowerCase().includes(value)
          })
        break;
        case 'meses':
          this.mesesFiltrados = this.meses.filter(
            option => {
              return option.toLowerCase().includes(value)
            })
          break;
      default:
        break;
    }
  }

  setDate(value, type){
    let fecha = moment(value).format('YYYY-MM-DD')
    if(type == 'desde'){
      //DESDE
      this.carpeta.validez_desde = fecha;
    }else{
      //HASTA
      this.carpeta.validez_hasta = fecha;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  submit() {
    if(this.carpeta.mes == '' || this.carpeta.paciente == '' || this.carpeta.prestador == '' || this.carpeta.validez_desde == '' || this.carpeta.validez_hasta == ''){
      return this.openSnackBar('Hay campos sin completar, por favor, utilizar el autocompletado', 'Cerrar');
    }

    if(moment(this.carpeta.validez_desde,'YYYY-MM-DD').isAfter(moment(this.carpeta.validez_hasta,'YYYY-MM-DD'))){
      return this.openSnackBar('La fecha de validez DESDE, es posterior a la fecha HASTA', 'Cerrar');
    }

    this.dialogRef.close(this.carpeta)
  }
}
