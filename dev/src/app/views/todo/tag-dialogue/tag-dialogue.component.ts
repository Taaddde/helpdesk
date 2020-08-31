import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tag } from 'app/shared/models/helpdesk/tag';
import { tagService } from 'app/shared/services/helpdesk/tag.service';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tag-dialogue',
  templateUrl: './tag-dialogue.component.html',
  styleUrls: ['./tag-dialogue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagDialogueComponent implements OnInit {

  public tags: Tag[];
  public token: string;
  public identity;

  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TagDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private _tagService: tagService,
    private _userService: userService
    ) { 
      this.token = _userService.getToken();
      this.identity = _userService.getIdentity();
    }

  ngOnInit() {
    this.getTags();
  }

  getTags(){
    this._tagService.getList(this.token, {company: this.identity['company']['_id']}).subscribe(
        response =>{
          if(response.tags){
             this.tags = response.tags;
          }
        }
    );
  }

  addTag(tagName: string) {
    let tag = new Tag('', tagName, this.identity['company']['_id'])

    this._tagService.add(this.token, tag).subscribe(
        response =>{
          if(response.tag){
            this.getTags();
          }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
    );
  }

  deleteTag(tag: Tag) {
    this._tagService.delete(this.token, tag._id).subscribe(
      response =>{
        if(response.tag){
          this.getTags();
        }
      },
      error =>{
        this.openSnackBar(error.message, 'Cerrar');
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

}
