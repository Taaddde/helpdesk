import { Component, OnInit, Input } from '@angular/core';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { todoService } from 'app/shared/services/helpdesk/todo.service';
import { interval } from 'rxjs';
import { depositService } from 'app/shared/services/helpdesk/deposit/deposit.service';
import { stockService } from 'app/shared/services/helpdesk/deposit/stock.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.template.html',
  providers: [userService, todoService, depositService, stockService]
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
    private _todoService: todoService,
    private _stockService: stockService,
    private _depositService: depositService
  ) {
    this.token = _userService.getToken();
  }
  ngOnInit() {
    this.setMenu();
    if(this.identity['role'] != 'ROLE_REQUESTER'){
      this.getCountTasks();
      this.getCountMissingStock();
      this.refresh = interval(15000).subscribe((val) => { 
        this.getCountTasks();
        this.getCountMissingStock();
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
          name: "Depósito",
          cod: '8',
          type: "icon",
          tooltip: "Depósito",
          icon: "shopping_basket",
          state: "deposit/home",
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
            { name: "Todos", state: "list/1/10", cod: '5.4'},
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
          ]
        },
        {
          name: "Deposito",
          cod: '7',
          type: "dropDown",
          tooltip: "Depósito",
          icon: "shopping_basket",
          state: "deposit",
          sub: [
            { name: "Principal", state: "home", cod: '7.1'},
            { name: "Nuevo movimiento", state: "movim/new", cod: '7.2'},
            { name: "Pedidos", state: "order/list", cod: '7.5'},
            { name: "Ver movimientos", state: "movim/list", cod: '7.3'},
            { name: "Crear pedido", state: "order/new", cod: '7.4'},
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
              state: "settings",
              sub: [
                { name: "Articulos", state: "item/list", cod: '6.3.1' },
                //{ name: "Habilitar articulos", state: "item/item", cod: '6.3.3' },
                { name: "Depósitos", state: "deposit/list", cod: '6.3.2' },
                { name: "Motivos", state: "reason/list", cod: '6.3.4' },
              ]
            },

            { name: "Internos",cod: '6.6', state: "settings/list/phonegroup",},

    
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
          name: "Depósito",
          cod: '8',
          type: "icon",
          tooltip: "Depósito",
          icon: "shopping_basket",
          state: "deposit/home",
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
            { name: "Todos", state: "list/1/10", cod: '5.4'},
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
          ]
        },
        {
          name: "Deposito",
          cod: '7',
          type: "dropDown",
          tooltip: "Depósito",
          icon: "shopping_basket",
          state: "deposit",
          sub: [
            { name: "Principal", state: "home", cod: '7.1'},
            { name: "Nuevo movimiento", state: "movim/new", cod: '7.2'},
            { name: "Ver movimientos", state: "movim/list", cod: '7.3'},
            { name: "Pedidos", state: "order/list", cod: '7.5'},
            { name: "Crear pedido", state: "order/new", cod: '7.4'},
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
              state: "settings",
              sub: [
                { name: "Articulos", state: "item/list", cod: '6.3.1' },
                { name: "Habilitar articulos", state: "item/enable", cod: '6.3.3' },
                { name: "Stock minimo", state: "item/stockmin", cod: '6.3.5' },
                { name: "Depósitos", state: "deposit/list", cod: '6.3.2' },
                { name: "Motivos", state: "reason/list", cod: '6.3.4' },
              ]
            },
            { name: "Internos",cod: '6.6', state: "settings/list/phonegroup",},

            { name: "Tipo/Subtipo de ticket", state: "settings/ticket/types", cod: '6.4'},
          ]
        },

        {
          name: "Analytics",
          cod: '9',
          type: "link",
          tooltip: "Analytics",
          icon: "leaderboard",
          state: "analytics/"+this.identity['company']['_id'],
        },

      ];
    }
  }

  getCountTasks(){
    let query: any = {users: this.identity['_id'], done: false};
    this._todoService.getCount(this.token, query).subscribe(
        response =>{
          if(response.count && response.count != 0){
              this.menuItems[1]['badges'] = {color: 'warn', value: response.count}
          }
        },
        error =>{
          this.menuItems[1]['badges'] = null;
        }
    );
  }

  getCountMissingStock(){
    let query = {company: this.identity['company']['_id']};
    this._depositService.getList(this.token, query).subscribe(
        response =>{
          if(response.deposits){
            let depositsIds = new Array();
            response.deposits.forEach(e => {
              depositsIds.push(e._id);
            });

            let query = { deposit: depositsIds, onOrder: false, $where: "this.cant < this.cantMin"};
            this._stockService.getList(this.token, query).subscribe(
              response =>{
                if(response.stocks){
                  let arr: Array<any> = response.stocks;
                  let count = arr.length;
                  this.menuItems[2]['badges'] = {color: 'warn', value: count}
                }
              },
              error =>{
                console.error(error);
              }
            );
          }
        },
        error =>{
          console.error(error);
        }
    );
  }

}