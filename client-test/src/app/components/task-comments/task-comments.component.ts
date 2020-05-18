import { Component, OnInit } from '@angular/core';
import { userService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { Work } from 'src/app/models/work';
import { WorkObservation } from 'src/app/models/workobservation';
import { workObservationService } from 'src/app/services/workobservation.service';
import * as moment from 'moment';
import { uploadService } from 'src/app/services/upload.service';


@Component({
  selector: 'app-task-comments',
  templateUrl: './task-comments.component.html',
  styleUrls: ['./task-comments.component.scss'],
  providers: [userService, workObservationService, uploadService]

})
export class TaskCommentsComponent implements OnInit {

  public identity;
  public token;
  public url: string;

  public task: Work;
  public comments: WorkObservation[];
  public newComment: WorkObservation;

  constructor(
    private _userService: userService,
    private _workObservationService: workObservationService,
    private _uploadService: uploadService,
    private _router: Router,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

    this.task = new Work('','','',this.identity['_id'],'',null,'','','','',false,'No comenzada','Normal');
    this.newComment = new WorkObservation('','','',this.identity['_id'],'',null,false);
  }

  ngOnInit() {
  }

  getComments(work: Work){

    this.task = work;
    this.newComment.work = this.task._id;

    this._workObservationService.getList(this.token, work._id).subscribe(
      response =>{
        if(response.workObservations){
          this.comments = response.workObservations;
        }
      },
      error =>{
          console.error(error);
    });
  
  }

  convertDate(val: string){
    return moment(val, 'YYYY-MM-DD HH:mm').locale('es').format('DD MMM YYYY')+' @ '+moment(val, 'YYYY-MM-DD HH:mm').locale('es').format('HH:mm');
  }

  getFiles(val: string){
    return val.split(',')
  }

  public filesToUpload: Array<File>;
  public fileChangeEvent(fileInput:any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  async onSubmit(){

    if(this.newComment.text != ''){
      this._workObservationService.add(this.token,this.newComment).subscribe(
        response =>{
            if(response.workObservation){
              if(this.filesToUpload){
                this._uploadService.makeFileRequest(this.url+'workobservation/file/'+response.workObservation._id, [], this.filesToUpload, this.token, 'file');
              }
              
              this.newComment.text = '';
              let input = document.getElementById("text") as HTMLInputElement;
              input.value = '';
  
            }
  
            this.getComments(this.task);
            this.filesToUpload = new Array<File>();
        },
        error =>{
            console.error(error);
        }
      );
  
    }

  }

}
