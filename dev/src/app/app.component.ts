import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { RoutePartsService } from "./shared/services/route-parts.service";
// import { ThemeService } from './shared/services/theme.service';

import { filter } from 'rxjs/operators';
import { userService } from './shared/services/helpdesk/user.service';
// import { LayoutService } from './shared/services/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [userService]
})
export class AppComponent implements OnInit, AfterViewInit {
  appTitle = 'HSJD';
  pageTitle = '';

  public identity;

  constructor(
    public title: Title, 
    private router: Router, 
    private activeRoute: ActivatedRoute,
    private routePartsService: RoutePartsService,
    private _userService: userService,
    // private layout: LayoutService,
    // private renderer: Renderer2
  ) {
    this.identity = _userService.getIdentity();
    
   }

  ngOnInit() {
    this.changePageTitle();

    if(this.identity['company']){
      this.appTitle = this.identity['company']['name'];
    }
  }
  ngAfterViewInit() {
  }
  changePageTitle() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((routeChange) => {
      var routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
      if (!routeParts.length)
        return this.title.setTitle(this.appTitle);
      // Extract title from parts;
      this.pageTitle = routeParts
                      .reverse()
                      .map((part) => part.title )
                      .reduce((partA, partI) => {return `${partA} > ${partI}`});
      this.pageTitle += ` | ${this.appTitle}`;
      this.title.setTitle(this.pageTitle);
    });
  }
  
}
