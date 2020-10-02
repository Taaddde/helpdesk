import { Component, OnInit, ViewChild } from '@angular/core';
import {Sector} from '../../models/sector';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { userService } from '../../services/user.service';
import { sectorService } from '../../services/sector.service';
import * as moment from 'moment';
import { MessageComponent } from '../message/message.component';
declare var $: any;


@Component({
  selector: 'app-sector-list',
  templateUrl: './sector-list.component.html',
  styleUrls: ['../../styles/list.scss'],
  providers:[userService, sectorService, MessageComponent]
})
export class SectorListComponent implements OnInit {
  @ViewChild(MessageComponent, {static:false}) message: MessageComponent;
  public title: String;
  public sectors: Sector[];
  public identity;
  public token;
  public url: string;

  public limit: number;
  public page: number;
  public user: string;

  public nextPage: boolean;
  public prevPage: boolean;
  public totalDocs: number;
  public totalPages: number;
  public pagingCounter: number;

  public query: any;
  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _sectorService: sectorService,
    private _userService: userService
){
    this.title = 'sectors',
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.limit= 10;
    this.page= 1;
    this.user = '';
    this.nextPage = true;
    this.prevPage= false;
    this.totalDocs= null;
    this.totalPages= 1;
    this.pagingCounter = 1;


    this.message = new MessageComponent();

  }

  ngOnInit() {
    this.getSectors();
  }

  showModal(){
    $("#newsector").modal("show");
  }

  getSectors(){
        this._sectorService.getList(this.token).subscribe(
          response =>{
              if(!response.sectors){
                //this._router.navigate(['/']);
              }else{
                this.sectors = response.sectors;
              }
          },
          error =>{
              console.error(error);
          }
        );
  }

  isLastPage(){
    if(this.totalDocs < this.pagingCounter+this.limit){
      return this.totalDocs;
    }else{
      return this.pagingCounter+this.limit-1;
    }
  }

  changeLimit(val: number){
    this.limit = val;
    this.getSectors();
  }

  changeDate(val:string){
    return moment(val, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm');
  }

  selectSector(event, sector: Sector){
      this._router.navigate(['/sector',sector._id]);
  }

}
