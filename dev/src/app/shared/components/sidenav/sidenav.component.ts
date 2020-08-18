import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.template.html'
})
export class SidenavComponent {
  @Input('items') public menuItems: any[] = [];
  @Input('hasIconMenu') public hasIconTypeMenuItem: boolean;
  @Input('iconMenuTitle') public iconTypeMenuTitle: string;
  @Input() identity;
  
  constructor() {}
  ngOnInit() {
    this.authGuard();
  }

  authGuard(){
    this.menuItems.forEach(e1 => {
      //Saca 1 nivel
      if(e1.role && e1.role != this.identity['role'] ){
        this.menuItems.splice(this.menuItems.indexOf(e1), 1);
      }
      if(e1.sub){
        let sub2 = e1.sub;
        sub2.forEach(e2 => {
          //Saca 2 nivel
          if(e2.role && e2.role != this.identity['role']){
            sub2.splice(sub2.indexOf(e2), 1);
          }
          if(e2.sub){
            let sub3 = e2.sub;
            sub3.forEach(e3 => {
              //Saca 3 nivel
              if(e3.role && e3.role != this.identity['role']){
                sub3.splice(sub3.indexOf(e3), 1);
              }
            });
          }
        });
      }
    });
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