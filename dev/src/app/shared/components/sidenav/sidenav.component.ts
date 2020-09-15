import { Component, OnInit, Input } from '@angular/core';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { todoService } from 'app/shared/services/helpdesk/todo.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.template.html',
  providers: [userService, todoService]
})
export class SidenavComponent {
  @Input('items') public menuItemss: any[] = [];
  @Input('hasIconMenu') public hasIconTypeMenuItem: boolean;
  @Input('iconMenuTitle') public iconTypeMenuTitle: string;
  @Input() identity;

  public menuItems: any[];
  public token: string;
  public refresh;

  constructor(
    private _userService: userService,
    private _todoService: todoService
  ) {
    this.token = _userService.getToken();
  }
  ngOnInit() {
    this.setMenu();
    if(this.identity['role'] != 'ROLE_REQUESTER'){
      this.getCountTasks();
      this.refresh = interval(15000).subscribe((val) => { 
        this.getCountTasks();
      }); 
    }
  }

  ngOnDestroy(): void {
    this.refresh.unsubscribe();
  }

  setMenu(){
    if(this.identity['role'] == 'ROLE_REQUESTER'){
      this.menuItems = [
        {
          name: "Nuevo ticket",
          cod: '1',
          type: "icon",
          tooltip: "Nuevo ticket",
          icon: "local_activity",
          state: "ticket/new",
        },
        {
          name: "Principal",
          cod: '3',
          type: "link",
          tooltip: "Principal",
          icon: "home",
          state: "home",
        },
        {
          name: "Tickets",
          cod: '4',
          type: "dropDown",
          tooltip: "Tickets",
          icon: "chat",
          state: "ticket",
          role: 'ROLE_REQUESTER',
          sub: [
            { 
              cod: '4.1',
              name: "Pendientes", state: "list/1/10", 
              query:{status:'Pendiente', requester:this.identity['_id']}
            },
            { 
              cod: '4.2',
              name: "Finalizados", state: "list/1/10", 
              query:{status:'Finalizado', requester:this.identity['_id']}
            },
            { name: "Todos", state: "list/1/10", cod: '4.3'},
          ]
        },
      ];
    }



    if(this.identity['role'] == 'ROLE_AGENT'){
      this.menuItems = [
        {
          name: "Nuevo ticket",
          cod: '1',
          type: "icon",
          tooltip: "Nuevo ticket",
          icon: "local_activity",
          state: "ticket/new",
        },
        {
          name: "Tareas",
          cod: '2',
          type: "icon",
          role: "ROLE_AGENT",
          tooltip: "Tarea",
          icon: "view_list",
          state: "todo/list",
        },
        {
          name: "Principal",
          cod: '3',
          type: "link",
          tooltip: "Principal",
          icon: "home",
          state: "home",
        },
        {
          name: "Tickets",
          cod: '5',
          type: "dropDown",
          tooltip: "Tickets",
          icon: "chat",
          state: "ticket",
          role: 'ROLE_AGENT',
          sub: [
            { 
              name: "Pendientes", state: "list/1/10", 
              cod: '5.1',
              query:{status:'Pendiente', agent:this.identity['_id']}
            },
            { 
              name: "Finalizados", state: "list/1/10", 
              cod: '5.2',
              query:{status:'Finalizado', agent:this.identity['_id']}
            },
            { name: "Abiertos", state: "list/1/10", cod: '5.3', query:{status:'Abierto'}},
            { name: "Todos", state: "list/1/10", cod: '5.4'},
          ]
        },
        {
          name: "Configuración",
          type: "dropDown",
          cod: '6',
          tooltip: "Configuración",
          icon: "settings",
          state: "",
          role: "ROLE_AGENT",
          sub: [
            { 
              name: "Usuarios",
              cod: '6.1',
              type: "dropDown",
              state: "user",
              sub: [
                { name: "Agentes", state: "list/agent", cod: '6.1.1' },
                { name: "Solicitantes", state: "list/requester", cod: '6.1.2'},
                { name: "Equipo", state: "list/team", cod: '6.1.3'},
              ]
            },
            // { 
            //   name: "Depósito",
            //   type: "dropDown",
            //   icon: "group", 
            //   cod: '6.3',  
            //   state: "group",
            //   sub: [
            //     { name: "Articulos", state: "home", cod: '6.3.1' },
            //     { name: "Depósitos", state: "home", cod: '6.3.2' },
            //   ]
            // },
    
            { name: "Tipo/Subtipo de ticket", state: "settings/ticket/types", cod: '6.4'},
          ]
        },
      ];
    }



    if(this.identity['role'] == 'ROLE_ADMIN'){
      this.menuItems = [
        {
          name: "Nuevo ticket",
          cod: '1',
          type: "icon",
          tooltip: "Nuevo ticket",
          icon: "local_activity",
          state: "ticket/new",
        },
        {
          name: "Tareas",
          cod: '2',
          type: "icon",
          role: "ROLE_AGENT",
          tooltip: "Tarea",
          icon: "view_list",
          state: "todo/list",
        },
        {
          name: "Principal",
          cod: '3',
          type: "link",
          tooltip: "Principal",
          icon: "home",
          state: "home",
        },
        {
          name: "Tickets",
          cod: '5',
          type: "dropDown",
          tooltip: "Tickets",
          icon: "chat",
          state: "ticket",
          role: 'ROLE_AGENT',
          sub: [
            { 
              name: "Pendientes", state: "list/1/10", 
              cod: '5.1',
              query:{status:'Pendiente', agent:this.identity['_id']}
            },
            { 
              name: "Finalizados", state: "list/1/10", 
              cod: '5.2',
              query:{status:'Finalizado', agent:this.identity['_id']}
            },
            { name: "Abiertos", state: "list/1/10", cod: '5.3', query:{status:'Abierto'}},
            { name: "Todos", state: "list/1/10", cod: '5.4'},
          ]
        },
        {
          name: "Configuración",
          type: "dropDown",
          cod: '6',
          tooltip: "Configuración",
          icon: "settings",
          state: "",
          role: "ROLE_AGENT",
          sub: [
            { 
              name: "Usuarios",
              cod: '6.1',
              type: "dropDown",
              state: "user",
              sub: [
                { name: "Agentes", state: "list/agent", cod: '6.1.1' },
                { name: "Solicitantes", state: "list/requester", cod: '6.1.2'},
                { name: "Equipo", state: "list/team", cod: '6.1.3'},
              ]
            },
            { 
              name: "Grupos",
              type: "dropDown",
              icon: "group",   
              cod: '6.2',
              state: "settings",
              role: "ROLE_ADMIN",
              sub: [
                { name: "Sector", state: "list/sector", cod: '6.2.1'},
                { name: "Departamento", state: "company", role: "ROLE_ADMIN", cod: '6.2.1'}
              ]
            },
            // { 
            //   name: "Depósito",
            //   type: "dropDown",
            //   icon: "group", 
            //   cod: '6.3',  
            //   state: "group",
            //   sub: [
            //     { name: "Articulos", state: "home", cod: '6.3.1' },
            //     { name: "Depósitos", state: "home", cod: '6.3.2' },
            //   ]
            // },
    
            { name: "Tipo/Subtipo de ticket", state: "settings/ticket/types", cod: '6.4'},
          ]
        },
      ];
    }
  }

  getCountTasks(){
    let query: any = {users: this.identity['_id']};
    this._todoService.getCount(this.token, query).subscribe(
        response =>{
          if(response.count && response.count != 0){
              this.menuItems[1]['badges'] = {color: 'warn', value: response.count}
          }
        },
        error =>{
          console.log(error);
        }
    );
  }
}