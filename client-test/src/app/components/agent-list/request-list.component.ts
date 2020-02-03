import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { userService } from '../../services/user.service';
import { User } from '../../models/user';
import {Router, ActivatedRoute, Params} from '@angular/router'
import {GLOBAL} from '../../services/global'
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-requester-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['../../styles/list.scss'],
  providers:[userService]
})
export class RequesterListComponent implements OnInit {
  @ViewChild(MessageComponent, {static:false}) message: MessageComponent;

  public users: User[];
  public filtro: String;
  public identity;
  public token;
  public url: string;
  public nextPage;
  public prevPage;
  public confirmado: String;
  public requester: boolean;

  public groupUser: string[];
  

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService
  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.nextPage = 1;
    this.prevPage = 1;
    this.requester = true;
    this.message = new MessageComponent();
    this.groupUser = new Array<string>();

  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(){
    this._userService.getListReq(this.token, this.identity['_id']).subscribe(
      response =>{
          if(!response.users){
            this._router.navigate(['/']);
          }else{
            this.users = response.users;
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

  selectUser(event, user: User){
    if(event.ctrlKey){
      if(this.groupUser.indexOf(user._id) != -1){
        this.groupUser.splice(this.groupUser.indexOf(user._id),1);
      }else{
        if(this.groupUser.length >= 2){
          this.groupUser.splice(0, 1);
          this.groupUser.push(user._id)
        }else{
          this.groupUser.push(user._id)
        }
      }
    }else{
      this._router.navigate(['/user/edit',user._id]);
    }
  }

  isInGroup(user:User){
    if(this.groupUser.indexOf(user._id) == -1){
      return false;
    }else{
      return true;
    }
  }

  searchName(id:string){
    for (let i = 0; i < this.users.length; i++) {
      if(this.users[i]._id == id){
        return this.users[i].name+' '+this.users[i].surname+' - '+this.users[i].userName
      }
      
    }
  }

  unify(origin:string, destiny:string){
    if (confirm('¿Esta seguro que quiere unificar los usuarios seleccionados?')) {
      this._userService.unify(this.token, origin, destiny).subscribe(
        response =>{
            if(!response.user){
              this._router.navigate(['/']);
            }else{
              this.message.info('Unificación realizada', 'La unificación fue realizada correctamente.')
              this.groupUser = new Array<string>();
              this.getUsers();
            }
        },
        error =>{
            console.error(error);
        });
    }

  }

}
