import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { uploadService } from 'app/shared/services/helpdesk/upload.service';
import { companyService } from 'app/shared/services/helpdesk/company.service';
import { Company } from 'app/shared/models/helpdesk/company';

@Component({
  selector: 'app-user-profile',
  templateUrl: './company.component.html',
  providers: [userService, companyService, uploadService]
})
export class CompanyProfileComponent implements OnInit {

  public company: Company;
  public identity;
  public token: string;
  public url: string;
  public isAdmin: boolean;

  constructor(
    private _userService: userService,
    private _companyService: companyService,
    private _uploadService: uploadService,
    private _route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
    this.url = GLOBAL.url;
    this.isAdmin = false;
  }

  ngOnInit() {
    this.getCompany();
  }

  getCompany(){
    this._companyService.getOne(this.token, this.identity['company']['_id']).subscribe(
      response =>{
        if(response.company){
          this.company = response.company;
          if(this.identity['role'] == 'ROLE_ADMIN'){
            this.isAdmin = true;
          }
        }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      })
  }

  editCompany(){
    if(!this.company.chat || (this.company.chat && moment(this.company.chatScheduleFrom, 'HH:mm').isValid() && moment(this.company.chatScheduleTo, 'HH:mm').isValid()) ){
      if(this.company.mailSender == false){
        this.company.password = '';
      }
      this._companyService.edit(this.token, this.company._id, this.company).subscribe(
        response =>{
            if(response.company){
                this.openSnackBar('Datos actualizados', 'Cerrar')
            }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
      );
    }else{
      this.openSnackBar('Faltan campos para completar', 'Cerrar');
    }
  }

  openAttachment() {
    document.getElementById('attachment').click();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
    this.filesToUpload = <Array<File>>fileInput.target.files;


    this._uploadService.makeFileRequest(this.url+'company/image/'+this.company._id, [], this.filesToUpload, this.token, 'image');
    setTimeout(() => {
      this.getCompany();
      this.openSnackBar('Foto de departamento actualizada', 'Cerrar')
    }, 1000);
    
  }

}