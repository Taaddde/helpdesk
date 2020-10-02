import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { notificationService } from 'app/shared/services/helpdesk/notification.service';
import * as moment from 'moment';
import { interval } from 'rxjs';
import * as hopscotch from 'hopscotch';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header-side',
  templateUrl: './header-side.template.html',
   styleUrls: ['./header-side.component.css'],
  providers: [userService, notificationService]
})
export class HeaderSideComponent implements OnInit {
  @Input() notificPanel;
  @Input() identity;
  public url;
  public token: string;

  public count: number = 0;
  public refresh;

  public tourSteps;

  public egretThemes;
  public layoutConf:any;

  public emitter: void;

  constructor(
    private themeService: ThemeService,
    private layout: LayoutService,
    public translate: TranslateService,
    private renderer: Renderer2,
    private router: Router,
    private _userService: userService,
    private _notificationService: notificationService,
    private snackBar: MatSnackBar,
  ) {
    this.url = GLOBAL.url;
    this.token = _userService.getToken();

    this.router.events.subscribe((val) => {
      this.tour();
    });
  }


  //#region OnInit y OnDestroy
    ngOnInit() {
      this.egretThemes = this.themeService.egretThemes;
      this.layoutConf = this.layout.layoutConf;

      this.configTour();
      this.tour();
      this.getCountNotifications();
      this.refresh = interval(5000).subscribe((val) => { 
        this.getCountNotifications();
      });
    }

    ngOnDestroy() {
      hopscotch.endTour(true);
    }

  //#endregion

  //#region Themes, Toggles y collapses
    changeTheme(theme) {
      // this.themeService.changeTheme(theme);
    }

    toggleNotific() {
      this.notificPanel.toggle();
    }

    toggleSidenav() {
      if(this.layoutConf.sidebarStyle === 'closed') {
        return this.layout.publishLayoutChange({
          sidebarStyle: 'full'
        })
      }
      this.layout.publishLayoutChange({
        sidebarStyle: 'closed'
      })
    }

    toggleCollapse() {
      // compact --> full
      if(this.layoutConf.sidebarStyle === 'compact') {
        return this.layout.publishLayoutChange({
          sidebarStyle: 'full',
          sidebarCompactToggle: false
        }, {transitionClass: true})
      }

      // * --> compact
      this.layout.publishLayoutChange({
        sidebarStyle: 'compact',
        sidebarCompactToggle: true
      }, {transitionClass: true})

    }

    onSearch(e) {
      //   console.log(e)
    }

  //#endregion

  //#region Funciones
    getCountNotifications(){
      let now = moment().format('YYYY-MM-DD HH:mm')
      let query = {user: this.identity['_id'], dateInit: now};
      this._notificationService.getCount(this.token, query).subscribe(
          response =>{
            if(response.count){
              this.count = response.count;
            }else{
              this.count = 0;
            }
          },
          error =>{
            this.count = 0;
          });
    }

    configTour(){
      hopscotch.configure(
        {i18n:
          {
            doneBtn: 'Terminar',
            nextBtn: 'Siguiente',
            prevBtn: 'Anterior'
          }
        }
      );
    }

    changeTo(actualRole){
      if(actualRole == 'ROLE_REQUESTER'){
        this._userService.getOne(this.token, this.identity['_id']).subscribe(
          response =>{
            if(response.user){
              localStorage.setItem('identity', JSON.stringify(response.user));
              location.reload();      
            }
          },
          error =>{
            console.error(error);
          }
        )
      }else{
        let identity = this.identity;
        identity['role'] = 'ROLE_REQUESTER';
        identity['company'] = null;
        identity['changedMode'] = true;
        localStorage.setItem('identity', JSON.stringify(identity));
        location.reload();
      }
    }

    tour(){
     switch (this.router.url) {
       case '/ticket/new':
         if(this.identity['role'] != 'ROLE_REQUESTER'){
          this.tourSteps = this.stepTicketNewAgent();
         }else{
          this.tourSteps = this.stepTicketNewRequester();
         }
         break;
        case '/home':
          if(this.identity['role'] != 'ROLE_REQUESTER'){
            this.tourSteps = this.stepHomeAgent();
           }else{
            this.tourSteps = this.stepHomeRequester();
           }
         break;
        case '/todo/list':
          this.tourSteps = this.stepTodoList();
         break;
       default:
         if(this.router.url.includes('/ticket/gestion')){
          this.tourSteps = this.stepTicketGestion();
         }else{
           if(this.router.url.includes('/ticket/list')){
            this.tourSteps = this.stepTicketList();
           }else{
            this.tourSteps = undefined;
           }
         }
         break;
     }
    }

    startTour() {
      hopscotch.endTour(true);
      hopscotch.startTour(this.tourSteps);
    }

    signOut(){
      localStorage.removeItem('identity');
      localStorage.removeItem('token');
      localStorage.clear();
      
      this.router.navigate(['/sessions/signin']);
    }

  //#endregion

  //#region steps configurados

    stepTicketNewAgent(){
      let self = this;
      return {
        id: 'demo-tour',
        showPrevButton: true,
        onEnd: function() {
          self.snackBar.open('Fin de la guía', 'Cerrar', { duration: 3000 });
        },
        onClose: function() {
          self.snackBar.open('Guía cerrada', 'Cerrar', { duration: 3000 });
        },
        steps: [
          {
            title: 'Descripción',
            content: 'Este formulario se completa para generar un ticket de soporte en el sistema',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 50
          },
          {
            title: 'Solicitante',
            content: 'Escribir la primer letra para buscar entre los solicitantes cargados por sistema',
            target: 'bread', // Element ID
            placement: 'top',
            xOffset: 70,
            yOffset: 80,
          },
          {
            title: 'Asunto y descripción',
            content: 'Escribir el asunto del ticket, junto a una breve descripción del inconveniente',
            target: 'bread', // Element ID
            placement: 'top',
            xOffset: 500,
            yOffset: 80,
          },
          {
            title: 'Responsables',
            content: 'Completar si es necesario el equipo y agente que se encargará de este ticket.',
            target: 'bread', // Element ID
            placement: 'left',
            xOffset: 940,
            yOffset: 60,
          },
        ]
      }
    }

    stepTicketNewRequester(){
      let self = this;
      return {
        id: 'demo-tour',
        showPrevButton: true,
        onEnd: function() {
          self.snackBar.open('Fin de la guía', 'Cerrar', { duration: 3000 });
        },
        onClose: function() {
          self.snackBar.open('Guía cerrada', 'Cerrar', { duration: 3000 });
        },
        steps: [
          {
            title: 'Descripción',
            content: 'Este formulario se completa para generar un ticket de soporte en el sistema',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 50
          },
          {
            title: 'Tipo de ticket',
            content: 'Selecciona el departamento a quien va dirigido, también categoriza tu ticket en un tipo y subtipo, que nos ayuda a derivar el ticket al personal encargado.',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 70,
            yOffset: 70,
          },
          {
            title: 'Asunto y descripción',
            content: 'Escribir el asunto del ticket, junto a una breve descripción de la solicitud.',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 500,
            yOffset: 70,
          },
          {
            title: 'En copia',
            content: 'Antes de generar el ticket, podes poner en copia a otros usuarios del sistema, para que reciban novedades y notificaciones sobre esta solicitud.',
            target: 'bread', // Element ID
            placement: 'left',
            xOffset: 950,
            yOffset: 60,
          },
        ]
      }
    }

    stepHomeRequester(){
      let self = this;
      return {
        id: 'demo-tour',
        showPrevButton: true,
        onEnd: function() {
          self.snackBar.open('Fin de la guía', 'Cerrar', { duration: 3000 });
        },
        onClose: function() {
          self.snackBar.open('Guía cerrada', 'Cerrar', { duration: 3000 });
        },
        steps: [
          {
            title: 'Principal',
            content: 'La pantalla principal muestra tus tickets, tanto los que esten pendientes como finalizados.',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 50
          },
          {
            title: 'Tus tickets',
            content: 'Son tus tickets y los que otras personas quieren que veas, que aún no han sido finalizados, dando click a este botón se enlistan dichos tickets.',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 70,
            yOffset: 100,
          },
          {
            title: 'Tickets resueltos',
            content: 'Son tus tickets y los que otras personas quieren que veas, que han sido finalizados, dando click a este botón se enlistan dichos tickets.',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 500,
            yOffset: 100,
          },
        ]
      }
    }

    stepHomeAgent(){
      let self = this;
      return {
        id: 'demo-tour',
        showPrevButton: true,
        onEnd: function() {
          self.snackBar.open('Fin de la guía', 'Cerrar', { duration: 3000 });
        },
        onClose: function() {
          self.snackBar.open('Guía cerrada', 'Cerrar', { duration: 3000 });
        },
        steps: [
          {
            title: 'Principal',
            content: 'La pantalla principal permite controlar el estado.',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 50
          },
          {
            title: 'Tus tickets',
            content: 'Son los tickets de los que sos responsable de solucionar, dandole click se genera una lista de los mismos.',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 70,
            yOffset: 100,
          },
          {
            title: 'Tickets sin equipo',
            content: 'Son los tickets que no tienen asignado agente/equipo y requieren que un agente los derive a un responsable, dandole click se genera una lista de los mismos.',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 460,
            yOffset: 100,
          },
          {
            title: 'Tickets resueltos',
            content: 'Son los tickets que tenes resueltos, dandole click se genera una lista de los mismos.',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 800,
            yOffset: 100,
          },
          {
            title: 'Tickets sin agente',
            content: 'Son tickets asignados a tu equipo, que ningún agente aún tomó para resolver.',
            target: 'bread', // Element ID
            placement: 'top',
            xOffset: 500,
            yOffset: 250,
          },
        ]
      }
    }

    stepTodoList(){
      let self = this;
      return {
        id: 'demo-tour',
        showPrevButton: true,
        onEnd: function() {
          self.snackBar.open('Fin de la guía', 'Cerrar', { duration: 3000 });
        },
        onClose: function() {
          self.snackBar.open('Guía cerrada', 'Cerrar', { duration: 3000 });
        },
        steps: [
          {
            title: 'Tareas',
            content: 'Esta es la lista de tareas de hay en el departamento.',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 50
          },
          {
            title: 'Filtro por estado',
            content: 'Podes filtrar tus tareas por Realizado, No realizado, Importante, No Importante, Favorito, No Favorito, Leído, No Leído o Todo - Mios... La opción de Todo, Todo - Pendientes y Todo - Realizados filtra entre todas las tareas de tu departamento',
            target: 'bread', // Element ID
            placement: 'top',
            xOffset: 30,
            yOffset: 200,
          },
          {
            title: 'Filtro por etiqueta',
            content: 'Podes filtrar tareas por las diferentes etiquetas creadas por los agentes de tu departamento.',
            target: 'bread', // Element ID
            placement: 'top',
            xOffset: 80,
            yOffset: 200,
          },
          {
            title: 'Tarea',
            content: 'Una tarea pendiente puede estar de color blanco si aún no fue marcada como leída o de color gris si ya fué marcada como leída. Una tarea marcada como realizada va a tener color verde.',
            target: 'bread', // Element ID
            placement: 'top',
            xOffset: 80,
            yOffset: 250,
          },
          {
            title: 'Importante',
            content: 'Una tarea puede marcarse como importante.',
            target: 'bread', // Element ID
            placement: 'left',
            xOffset: 960,
            yOffset: 260,
          },
          {
            title: 'Favorito',
            content: 'Una tarea puede marcarse como favorito.',
            target: 'bread', // Element ID
            placement: 'left',
            xOffset: 990,
            yOffset: 260,
          },
          {
            title: 'Leída/Realizada',
            content: 'En esta opción puede marcarse una tarea como leída/realizada.',
            target: 'bread', // Element ID
            placement: 'left',
            xOffset: 1030,
            yOffset: 260,
          },
          {
            title: 'Buscador de tareas',
            content: 'Busca una tarea de la lista por su titulo.',
            target: 'bread', // Element ID
            placement: 'top',
            xOffset: 70,
            yOffset: 100,
          },
          {
            title: 'Crear tarea',
            content: 'Crea una nueva tarea para vos u otro agente de tu departamento.',
            target: 'bread', // Element ID
            placement: 'left',
            xOffset: 940,
            yOffset: 180,
          },
        ]
      }
    }

    stepTicketGestion(){
      let self = this;
      return {
        id: 'demo-tour',
        showPrevButton: true,
        onEnd: function() {
          self.snackBar.open('Fin de la guía', 'Cerrar', { duration: 3000 });
        },
        onClose: function() {
          self.snackBar.open('Guía cerrada', 'Cerrar', { duration: 3000 });
        },
        steps: [
          {
            title: 'Gestión de ticket',
            content: 'El gestor de ticket se encarga de mantener una comunicación por chat entre agente-solicitante, además de observar en tiempo real las novedades del mismo.',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 50
          },
          {
            title: 'Menú lateral',
            content: 'Este menú tiene varias solapas. "Información general" muestran los datos esenciales del ticket, "Solicitante" muestra los datos del solicitante del ticket, "Responsable" muestra los datos de los responsables de la solución del ticket y "En copia" permite poner en copia a otros usuarios en el ticket.',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 70,
            yOffset: 100,
          },
          {
            title: 'Chat',
            content: 'Los mensajes con cabecera verde corresponden a solicitantes, con cabecera negra corresponden a agentes y cabecera celeste corresponde a información general.',
            target: 'bread', // Element ID
            placement: 'left',
            xOffset: 600,
            yOffset: 150,
          },
          {
            title: 'Adjuntos',
            content: 'Si se adjuntan archivos a un mensaje, aparecerán debajo a la derecha del mensaje.',
            target: 'bread', // Element ID
            placement: 'left',
            xOffset: 600,
            yOffset: 150,
          },
          {
            title: 'Nuevo mensaje',
            content: 'Puede escribir un nuevo mensaje en este apartado.',
            target: 'bread', // Element ID
            placement: 'top',
            xOffset: 600,
            yOffset: 450,
          },
          {
            title: 'Adjuntar archivo',
            content: 'Puede adjuntar un archivo a un mensaje con esta opción.',
            target: 'bread', // Element ID
            placement: 'top',
            xOffset: 380,
            yOffset: 540,
          },
          {
            title: 'Omitir mensajes de información',
            content: 'Puede omitir o mostrar los mensajes de información (los que tienen una cabecera celeste) clickeando en este botón, si queres dejar como predeterminado uno de los dos modos, podes configurarlo en tu perfil.',
            target: 'bread', // Element ID
            placement: 'left',
            xOffset: 400,
            yOffset: 50,
          },
        ]
      }
    }

    stepTicketList(){
      let self = this;
      return {
        id: 'demo-tour',
        showPrevButton: true,
        onEnd: function() {
          self.snackBar.open('Fin de la guía', 'Cerrar', { duration: 3000 });
        },
        onClose: function() {
          self.snackBar.open('Guía cerrada', 'Cerrar', { duration: 3000 });
        },
        steps: [
          {
            title: 'Listado de tickets',
            content: 'Permite visualizar y filtrar los tickets de tu departamento (en caso de ser una gente) o únicamente los tuyos (en caso de ser un solicitante).',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 50
          },
          {
            title: 'Motrar',
            content: 'Cambia la cantidad de tickets que se pueden visualizar por cada página.',
            target: 'bread', // Element ID
            placement: 'bottom',
            xOffset: 70,
            yOffset: 80,
          },
          {
            title: 'Filtro',
            content: 'Filtra los tickets según se requiera.',
            target: 'bread', // Element ID
            placement: 'top',
            xOffset: 50,
            yOffset: 120,
          },
          {
            title: 'Ticket',
            content: 'Cada uno esta identificado por un número, dando click en el ticket el sistema mostrará el detalle del mismo.',
            target: 'bread', // Element ID
            placement: 'top',
            xOffset: 70,
            yOffset: 200,
          },
          {
            title: 'Tickets del sector',
            content: 'Siendo referente del sector, esta opción permite cambiar la busqueda de los tickets para visualizar todos los tickets gestionados por tu sector.',
            target: 'bread', // Element ID
            placement: 'left',
            xOffset: 900,
            yOffset: 70,
          },
        ]
      }
    }

  //#endregion
}