import { Component, OnInit, OnDestroy, AfterViewInit, Input } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { ThemeService } from "../../services/theme.service";
import { Subscription } from "rxjs";
import { ILayoutConf, LayoutService } from "app/shared/services/layout.service";
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";
import { GLOBAL } from "app/shared/services/helpdesk/global";
import { Router } from "@angular/router";
import { userService } from "app/shared/services/helpdesk/user.service";

@Component({
  selector: "app-sidebar-side",
  templateUrl: "./sidebar-side.component.html",
  providers: [userService]
})
export class SidebarSideComponent implements OnInit, OnDestroy, AfterViewInit {
  public menuItems: any[];
  public hasIconTypeMenuItem: boolean;
  public iconTypeMenuTitle: string;
  private menuItemsSub: Subscription;
  public layoutConf: ILayoutConf;
  
  @Input() identity;
  public token: string;
  public url;

  public appName: string = 'HSJD';

  constructor(
    private navService: NavigationService,
    public themeService: ThemeService,
    private layout: LayoutService,
    public jwtAuth: JwtAuthService,
    private router: Router,
    private _userService: userService

  ) {
    this.url = GLOBAL.url;
    this.token = _userService.getToken();
  }

  ngOnInit() {
    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    this.menuItemsSub = this.navService.menuItems$.subscribe(menuItem => {
      this.menuItems = menuItem;
      //Checks item list has any icon type.
      this.hasIconTypeMenuItem = !!this.menuItems.filter(
        item => item.type === "icon"
      ).length;
    });
    this.layoutConf = this.layout.layoutConf;


    // if(this.identity['company']){
    //   this.appName = this.identity['company']['name'];
    //   this.appName = this.appName.toUpperCase();
    // }
  }
  ngAfterViewInit() {}
  ngOnDestroy() {
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
  }
  toggleCollapse() {
    if (
      this.layoutConf.sidebarCompactToggle
    ) {
        this.layout.publishLayoutChange({
        sidebarCompactToggle: false
      });
    } else {
        this.layout.publishLayoutChange({
            // sidebarStyle: "compact",
            sidebarCompactToggle: true
          });
    }
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

  signOut(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    
    this.router.navigate(['/sessions/signin']);
  }
}
