import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})


export class MessageComponent implements OnInit{

  public classConfig: any;
  public title: string;
  public message: string;

  constructor() { }

  ngOnInit(){
  }

  info(title, message){
    this.title = title;
    this.message = message;
    let element = document.getElementById("message");
    this.classConfig = {'alert alert-info d-inline float-right':true};
    element.classList.remove("message");
    void element.offsetWidth;
    element.classList.add("message");
  }

  error(title, message){
    this.title = title;
    this.message = message;
    let element = document.getElementById("message");
    this.classConfig = {'alert alert-danger d-inline float-right':true};
    element.classList.remove("message");
    void element.offsetWidth;
    element.classList.add("message");
  }


  success(title, message){
    this.title = title;
    this.message = message;
    let element = document.getElementById("message");
    this.classConfig = {'alert alert-success d-inline float-right':true};
    element.classList.remove("message");
    void element.offsetWidth;
    element.classList.add("message");
  }

}
