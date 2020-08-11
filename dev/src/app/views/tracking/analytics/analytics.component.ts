import { Component, OnInit} from "@angular/core";
  import { egretAnimations } from "app/shared/animations/egret-animations";
  import { ThemeService } from "app/shared/services/theme.service";
  import { userService } from "app/shared/services/helpdesk/user.service";
  declare var $: any;  
  
  @Component({
    selector: "app-tracking-analytics",
    templateUrl: "./analytics.component.html",
    providers: [userService],
    animations: egretAnimations
  })
  export class TrackingAnalyticsComponent implements OnInit {
    public token: string;

    constructor(
      private themeService: ThemeService,
      private _userService: userService,
    ) {
      this.token = _userService.getToken();
    }
  
    ngOnInit() {
    }

}