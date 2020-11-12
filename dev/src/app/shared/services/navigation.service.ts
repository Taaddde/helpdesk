import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface IMenuItem {
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  cod: string;
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  query?: any;
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
  role?: string;
}
interface IChildItem {
  type?: string;
  cod: string;
  name: string; // Display text
  state?: string; // Router state
  query?: any;
  icon?: string;
  sub?: IChildItem[];
  role?: string;
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {
  public identity = JSON.parse(localStorage.getItem('identity'));
  constructor() {
    
  }

  iconMenu: IMenuItem[] = [
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

  separatorMenu: IMenuItem[] = [
    // {
    //   type: "separator",
    //   name: "Custom components"
    // },
    // {
    //   name: "DASHBOARD",
    //   type: "link",
    //   tooltip: "Dashboard",
    //   icon: "dashboard",
    //   state: "dashboard"
    // },
    // {
    //   name: "INBOX",
    //   type: "link",
    //   tooltip: "Inbox",
    //   icon: "inbox",
    //   state: "inbox"
    // },
    // {
    //   name: "CHAT",
    //   type: "link",
    //   tooltip: "Chat",
    //   icon: "chat",
    //   state: "chat"
    // },
    // {
    //   name: "CRUD Table",
    //   type: "link",
    //   tooltip: "CRUD Table",
    //   icon: "format_list_bulleted",
    //   state: "cruds/ngx-table"
    // },
    // {
    //   name: "DIALOGS",
    //   type: "dropDown",
    //   tooltip: "Dialogs",
    //   icon: "filter_none",
    //   state: "dialogs",
    //   sub: [
    //     { name: "CONFIRM", state: "confirm" },
    //     { name: "LOADER", state: "loader" }
    //   ]
    // },
    // {
    //   name: "PROFILE",
    //   type: "dropDown",
    //   tooltip: "Profile",
    //   icon: "person",
    //   state: "profile",
    //   sub: [
    //     { name: "OVERVIEW", state: "overview" },
    //     { name: "SETTINGS", state: "settings" },
    //     { name: "BLANK", state: "blank" }
    //   ]
    // },
    // {
    //   name: "TOUR",
    //   type: "link",
    //   tooltip: "Tour",
    //   icon: "flight_takeoff",
    //   state: "tour"
    // },
    // {
    //   type: "separator",
    //   name: "Integrated components"
    // },
    // {
    //   name: "CALENDAR",
    //   type: "link",
    //   tooltip: "Calendar",
    //   icon: "date_range",
    //   state: "calendar"
    // },
    // {
    //   name: "MATERIAL",
    //   type: "dropDown",
    //   tooltip: "Material",
    //   icon: "favorite",
    //   state: "material",
    //   sub: [
    //     { name: "BUTTONS", state: "buttons" },
    //     { name: "Button Toggle", state: "button-toggle" },
    //     { name: "Buttons Loading", state: "loading-buttons" },
    //     { name: "CARDS", state: "cards" },
    //     { name: "GRIDS", state: "grids" },
    //     { name: "LISTS", state: "lists" },
    //     { name: "MENU", state: "menu" },
    //     { name: "TABS", state: "tabs" },
    //     { name: "SELECT", state: "select" },
    //     { name: "RADIO", state: "radio" },
    //     { name: "AUTOCOMPLETE", state: "autocomplete" },
    //     { name: "SLIDER", state: "slider" },
    //     { name: "PROGRESS", state: "progress" },
    //     { name: "SNACKBAR", state: "snackbar" }
    //   ]
    // },
    // {
    //   name: "FORMS",
    //   type: "dropDown",
    //   tooltip: "Forms",
    //   icon: "description",
    //   state: "forms",
    //   sub: [
    //     { name: "BASIC", state: "basic" },
    //     { name: "EDITOR", state: "editor" },
    //     { name: "UPLOAD", state: "upload" },
    //     { name: "WIZARD", state: "wizard" }
    //   ]
    // },
    // {
    //   name: "TABLES",
    //   type: "dropDown",
    //   tooltip: "Tables",
    //   icon: "format_line_spacing",
    //   state: "tables",
    //   sub: [
    //     { name: "FULLSCREEN", state: "fullscreen" },
    //     { name: "PAGING", state: "paging" },
    //     { name: "FILTER", state: "filter" }
    //   ]
    // },
    // {
    //   name: "MAP",
    //   type: "link",
    //   tooltip: "Map",
    //   icon: "add_location",
    //   state: "map"
    // },
    // {
    //   name: "CHARTS",
    //   type: "link",
    //   tooltip: "Charts",
    //   icon: "show_chart",
    //   state: "charts"
    // },
    // {
    //   name: "DND",
    //   type: "link",
    //   tooltip: "Drag and Drop",
    //   icon: "adjust",
    //   state: "dragndrop"
    // },
    // {
    //   type: "separator",
    //   name: "Other components"
    // },
    // {
    //   name: "SESSIONS",
    //   type: "dropDown",
    //   tooltip: "Pages",
    //   icon: "view_carousel",
    //   state: "sessions",
    //   sub: [
    //     { name: "SIGNUP", state: "signup" },
    //     { name: "SIGNIN", state: "signin" },
    //     { name: "FORGOT", state: "forgot-password" },
    //     { name: "LOCKSCREEN", state: "lockscreen" },
    //     { name: "NOTFOUND", state: "404" },
    //     { name: "ERROR", state: "error" }
    //   ]
    // },
    // {
    //   name: "OTHERS",
    //   type: "dropDown",
    //   tooltip: "Others",
    //   icon: "blur_on",
    //   state: "others",
    //   sub: [
    //     { name: "GALLERY", state: "gallery" },
    //     { name: "PRICINGS", state: "pricing" },
    //     { name: "USERS", state: "users" },
    //     { name: "BLANK", state: "blank" }
    //   ]
    // },
    // {
    //   name: "MATICONS",
    //   type: "link",
    //   tooltip: "Material Icons",
    //   icon: "store",
    //   state: "icons"
    // },
    // {
    //   name: "DOC",
    //   type: "extLink",
    //   tooltip: "Documentation",
    //   icon: "library_books",
    //   state: "http://demos.ui-lib.com/egret-doc/"
    // }
  ];

  plainMenu: IMenuItem[] = [
    // {
    //   name: "DASHBOARD",
    //   type: "link",
    //   tooltip: "Dashboard",
    //   icon: "dashboard",
    //   state: "dashboard"
    // },
    // {
    //   name: "INBOX",
    //   type: "link",
    //   tooltip: "Inbox",
    //   icon: "inbox",
    //   state: "inbox"
    // },
    // {
    //   name: "CHAT",
    //   type: "link",
    //   tooltip: "Chat",
    //   icon: "chat",
    //   state: "chat"
    // },
    // {
    //   name: "CRUD Table",
    //   type: "link",
    //   tooltip: "CRUD Table",
    //   icon: "format_list_bulleted",
    //   state: "cruds/ngx-table"
    // },
    // {
    //   name: "CALENDAR",
    //   type: "link",
    //   tooltip: "Calendar",
    //   icon: "date_range",
    //   state: "calendar"
    // },
    // {
    //   name: "DIALOGS",
    //   type: "dropDown",
    //   tooltip: "Dialogs",
    //   icon: "filter_none",
    //   state: "dialogs",
    //   sub: [
    //     { name: "CONFIRM", state: "confirm" },
    //     { name: "LOADER", state: "loader" }
    //   ]
    // },
    // {
    //   name: "MATERIAL",
    //   type: "dropDown",
    //   icon: "favorite",
    //   state: "component",
    //   sub: [
    //     { name: "BUTTONS", state: "buttons" },
    //     { name: "Button Toggle", state: "button-toggle" },
    //     { name: "Buttons Loading", state: "loading-buttons" },
    //     { name: "CARDS", state: "cards" },
    //     { name: "GRIDS", state: "grids" },
    //     { name: "LISTS", state: "lists" },
    //     { name: "MENU", state: "menu" },
    //     { name: "TABS", state: "tabs" },
    //     { name: "SELECT", state: "select" },
    //     { name: "RADIO", state: "radio" },
    //     { name: "AUTOCOMPLETE", state: "autocomplete" },
    //     { name: "SLIDER", state: "slider" },
    //     { name: "PROGRESS", state: "progress" },
    //     { name: "SNACKBAR", state: "snackbar" }
    //   ]
    // },
    // {
    //   name: "FORMS",
    //   type: "dropDown",
    //   tooltip: "Forms",
    //   icon: "description",
    //   state: "forms",
    //   sub: [
    //     { name: "BASIC", state: "basic" },
    //     { name: "EDITOR", state: "editor" },
    //     { name: "UPLOAD", state: "upload" },
    //     { name: "WIZARD", state: "wizard" }
    //   ]
    // },
    // {
    //   name: "TABLES",
    //   type: "dropDown",
    //   tooltip: "Tables",
    //   icon: "format_line_spacing",
    //   state: "tables",
    //   sub: [
    //     { name: "FULLSCREEN", state: "fullscreen" },
    //     { name: "PAGING", state: "paging" },
    //     { name: "FILTER", state: "filter" }
    //   ]
    // },
    // {
    //   name: "PROFILE",
    //   type: "dropDown",
    //   tooltip: "Profile",
    //   icon: "person",
    //   state: "profile",
    //   sub: [
    //     { name: "OVERVIEW", state: "overview" },
    //     { name: "SETTINGS", state: "settings" },
    //     { name: "BLANK", state: "blank" }
    //   ]
    // },
    // {
    //   name: "TOUR",
    //   type: "link",
    //   tooltip: "Tour",
    //   icon: "flight_takeoff",
    //   state: "tour"
    // },
    // {
    //   name: "MAP",
    //   type: "link",
    //   tooltip: "Map",
    //   icon: "add_location",
    //   state: "map"
    // },
    // {
    //   name: "CHARTS",
    //   type: "link",
    //   tooltip: "Charts",
    //   icon: "show_chart",
    //   state: "charts"
    // },
    // {
    //   name: "DND",
    //   type: "link",
    //   tooltip: "Drag and Drop",
    //   icon: "adjust",
    //   state: "dragndrop"
    // },
    // {
    //   name: "SESSIONS",
    //   type: "dropDown",
    //   tooltip: "Pages",
    //   icon: "view_carousel",
    //   state: "sessions",
    //   sub: [
    //     { name: "SIGNUP", state: "signup" },
    //     { name: "SIGNIN", state: "signin" },
    //     { name: "FORGOT", state: "forgot-password" },
    //     { name: "LOCKSCREEN", state: "lockscreen" },
    //     { name: "NOTFOUND", state: "404" },
    //     { name: "ERROR", state: "error" }
    //   ]
    // },
    // {
    //   name: "OTHERS",
    //   type: "dropDown",
    //   tooltip: "Others",
    //   icon: "blur_on",
    //   state: "others",
    //   sub: [
    //     { name: "GALLERY", state: "gallery" },
    //     { name: "PRICINGS", state: "pricing" },
    //     { name: "USERS", state: "users" },
    //     { name: "BLANK", state: "blank" }
    //   ]
    // },
    // {
    //   name: "MATICONS",
    //   type: "link",
    //   tooltip: "Material Icons",
    //   icon: "store",
    //   state: "icons"
    // },
    // {
    //   name: "DOC",
    //   type: "extLink",
    //   tooltip: "Documentation",
    //   icon: "library_books",
    //   state: "http://demos.ui-lib.com/egret-doc/"
    // }
  ];

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle: string = "";
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(menuType: string) {
    switch (menuType) {
      case "separator-menu":
        this.menuItems.next(this.separatorMenu);
        break;
      case "icon-menu":
        this.menuItems.next(this.iconMenu);
        break;
      default:
        this.menuItems.next(this.plainMenu);
    }
  }
}