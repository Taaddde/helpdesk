import { Component, Output, EventEmitter } from '@angular/core';
import { userService } from 'src/app/services/user.service';
import { sectorService } from 'src/app/services/sector.service';
import { Sector } from 'src/app/models/sector';
import { GLOBAL } from 'src/app/services/global';
declare var $: any;

@Component({
  selector: 'app-sector-new',
  templateUrl: './sector-new.component.html',
  styleUrls: ['../../styles/form.scss'],
  providers: [userService, sectorService]

})
export class SectorNewComponent{

  @Output() refreshList = new EventEmitter<string>();

  public sector: Sector;
  public identity;
  public token;
  public url: string;

  public isEdit: boolean

  constructor(
    private _userService: userService,
    private _sectorService: sectorService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.sector = new Sector('','','','');
    this.isEdit = false;
   }

  onSubmit(){
    if(this.sector.name != '' && this.sector.initials != '' && this.sector.email != ''){
      if(this.isEdit){
        this._sectorService.edit(this.token, this.sector._id, this.sector).subscribe(
          response =>{
              if(response.sector){
                this.refreshList.next();
                this.sector = new Sector('','','','');
                $("#newsector").modal("hide");
              }
          },
          error =>{
            var errorMessage = <any>error;
            if(errorMessage != null){
              var body = JSON.parse(error._body);
              alert(body.message);
            }
          }
        );
      }else{
        this._sectorService.add(this.token,this.sector).subscribe(
          response =>{
              if(response.sector){
                this.refreshList.next();
                this.sector = new Sector('','','','');
                $("#newsector").modal("hide");
              }
          },
          error =>{
            var errorMessage = <any>error;
            if(errorMessage != null){
              var body = JSON.parse(error._body);
              alert(body.message);
            }
          }
        );
      }
      
    }else{
      alert('Faltan campos para completar');
    }
    
  }

  getSector(id: string){
    this._sectorService.getOne(this.token, id).subscribe(
      response =>{
          if(response.sector){
            this.sector = response.sector;
            this.isEdit = true;
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

  newSector(){
    this.sector = new Sector('','','','');
    this.isEdit = false;
  }

  delete(){
    if(confirm("¿Esta seguro que quiere eliminar "+this.sector.name+"?")){
      this._sectorService.delete(this.token, this.sector._id).subscribe(
        response =>{
            if(response.sector){
              this.refreshList.next();
              this.sector = new Sector('','','','');
              $("#newsector").modal("hide");
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
}
