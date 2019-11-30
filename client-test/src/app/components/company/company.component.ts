import { Component, OnInit } from '@angular/core';
import { userService } from '../../services/user.service';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { uploadService } from '../../services/upload.service';
import { companyService } from '../../services/company.service';
import { Company } from '../../models/company';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['../../styles/form.scss'],
  providers: [userService, uploadService, companyService]

})
export class CompanyComponent implements OnInit {

  public identity;
  public token;
  public url: string;
  public company: Company;

  constructor(    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService,
    private _uploadService: uploadService,
    private _companyService: companyService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.company = new Company('','','',false, '','');
   }

  ngOnInit() {
    this.getCompany();
  }

  getCompany(){

    this._companyService.getOne(this.token, this.identity['company']['_id']).subscribe(
      response =>{
          if(!response.company){
            this._router.navigate(['/home']);
          }else{
            this.company = response.company;
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  onSubmit(){

    if(this.company.mailSender == false){
      this.company.password = '';
    }

    this._companyService.edit(this.token,this.identity['company']['_id'], this.company).subscribe(
      response =>{
          if(!response.company){
              alert('Error en el servidor');
          }else{
              if(this.filesToUpload){
                  this._uploadService.makeFileRequest(this.url+'company/image/'+response.company._id, [], this.filesToUpload, this.token, 'image')
              }
              alert('Datos guardados')
              this.getCompany();
          }
      },
      error =>{
          console.error(error);
      }
    );
  }

  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
