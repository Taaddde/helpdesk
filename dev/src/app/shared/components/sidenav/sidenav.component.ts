import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.template.html'
})
export class SidenavComponent {
  @Input('items') public menuItemss: any[] = [];
  @Input('hasIconMenu') public hasIconTypeMenuItem: boolean;
  @Input('iconMenuTitle') public iconTypeMenuTitle: string;
  @Input() identity;

  public menuItems: any[];
  
  constructor() {}
  ngOnInit() {
    

    this.setMenu();
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
            { 
              name: "Depósito",
              type: "dropDown",
              icon: "group", 
              cod: '6.3',  
              state: "group",
              sub: [
                { name: "Articulos", state: "home", cod: '6.3.1' },
                { name: "Depósitos", state: "home", cod: '6.3.2' },
              ]
            },
    
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
            { 
              name: "Depósito",
              type: "dropDown",
              icon: "group", 
              cod: '6.3',  
              state: "group",
              sub: [
                { name: "Articulos", state: "home", cod: '6.3.1' },
                { name: "Depósitos", state: "home", cod: '6.3.2' },
              ]
            },
    
            { name: "Tipo/Subtipo de ticket", state: "settings/ticket/types", cod: '6.4'},
          ]
        },
      ];
    }
  }

  authGuard(){
    console.log(this.menuItems)
    this.menuItems.forEach(e1 => {
      //Saca 1 nivel
      console.log(e1.name);
      console.log(!this.access(e1.role, this.identity['role']))
      if(!this.access(e1.role, this.identity['role'])){
        this.menuItems.splice(this.menuItems.indexOf(e1), 1);
      }
      if(e1.sub){
        let sub2 = e1.sub;
        sub2.forEach(e2 => {
          //Saca 2 nivel
          if(!this.access(e2.role, this.identity['role'])){
            sub2.splice(sub2.indexOf(e2), 1);
          }
          if(e2.sub){
            let sub3 = e2.sub;
            sub3.forEach(e3 => {
              //Saca 3 nivel
              if(!this.access(e3.role, this.identity['role'])){
                sub3.splice(sub3.indexOf(e3), 1);
              }
            });
          }
        });
      }
    });
  }

  access(role, myRole): boolean{
    if(!role)
      return true;

    if(role == 'ROLE_REQUESTER' && myRole == 'ROLE_REQUESTER')
      return true;

    if(role == 'ROLE_AGENT'){
      if(myRole == 'ROLE_AGENT' || myRole == 'ROLE_ADMIN')
        return true;
      else  return false;
    }

    if(role == 'ROLE_ADMIN' && myRole == 'ROLE_ADMIN')
      return true;


    return false;
  }

  // Only for demo purpose
  addMenuItem() {
    this.menuItems.push({
      name: 'ITEM',
      type: 'dropDown',
      tooltip: 'Item',
      icon: 'done',
      state: 'material',
      sub: [
        {name: 'SUBITEM', state: 'cards'},
        {name: 'SUBITEM', state: 'buttons'}
      ]
    });
  }
}