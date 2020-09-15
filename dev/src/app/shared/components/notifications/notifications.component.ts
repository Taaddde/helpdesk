import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { interval } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { notificationService } from 'app/shared/services/helpdesk/notification.service';
import { Notification } from 'app/shared/models/helpdesk/notification';
import * as moment from 'moment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  providers: [userService, notificationService]
})
export class NotificationsComponent implements OnInit {
  @Input() notificPanel;

  public token: string;
  public identity;

  public notifications: Notification[];
  public refresh;

  constructor(
    private router: Router,
    private _userService: userService,
    private _notificationService: notificationService
    ) {
      this.identity = _userService.getIdentity();
      this.token = _userService.getToken();
    }

  ngOnInit() {
    this.router.events.subscribe((routeChange) => {
        if (routeChange instanceof NavigationEnd) {
          this.notificPanel.close();
        }
    });

    this.getNotifications();
    this.refresh = interval(15000).subscribe((val) => { 
      this.getNotifications();
    });
  }

  ngOnDestroy() {
    this.refresh.unsubscribe();
  }

  deleteNotification(notification: Notification){
    this._notificationService.delete(this.token, notification._id).subscribe(
      response =>{
        this.notifications.splice(this.notifications.indexOf(notification),1);
      },
      error =>{
        console.log(error)
      }
  );
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
  }

  clearAll(e) {
    e.preventDefault();
    this.notifications.forEach(notification => {
      this._notificationService.delete(this.token, notification._id).subscribe(
          response =>{
            
          },
          error =>{
            console.log(error)
          }
      );
    });
    this.notifications = [];
  }

  getNotifications(){
    let now = moment().format('YYYY-MM-DD HH:mm')
    let query = {user: this.identity['_id'], dateInit: now};

    this._notificationService.getList(this.token, query).subscribe(
        response =>{
          if(response.notifications){
             this.notifications = response.notifications;

             this.notifications.forEach(notification => {
               notification['time'] = moment(notification.date, 'YYYY-MM-DD HH:mm').locale('es').fromNow(true);
             });
          }
        },
        error =>{
          console.log(error);
        }
    );
  }

  closePanel(){
    this.notificPanel.close();
  }

  getLenght(arr: Array<any>): number{
    return arr.length;
  }
}
