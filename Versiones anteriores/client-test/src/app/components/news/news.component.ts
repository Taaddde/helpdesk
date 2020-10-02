import { Component, OnInit } from '@angular/core';
import { userService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  providers:[userService]
})
export class NewsComponent implements OnInit {

  public identity;
  public token;

  constructor(
    private _userService: userService,
  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    this.getNews();
  }


  getNews(){
    this._userService.getNews(this.token, this.identity['_id']).subscribe(
      response =>{
          if(response && response.news){
            $("#news").modal("show");
          }
      },
      error =>{
          var errorMessage = <any>error;
          if(errorMessage != null){
          var body = JSON.parse(error._body);
          //this.alertMessage = body.message;
          console.error(error);
          }
      }
    );
  }


}
