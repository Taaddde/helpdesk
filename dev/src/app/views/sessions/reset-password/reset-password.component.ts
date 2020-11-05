import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { User } from 'app/shared/models/helpdesk/user';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { userService } from 'app/shared/services/helpdesk/user.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  providers: [userService]
})
export class ResetPasswordComponent implements OnInit {
  public validUrl:boolean;
  public user: User;
  public confirmPass: string;

  public title = 'Recuperación de contraseña';
  public url: string;

  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  constructor(
    private _userService: userService,
    private _route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { 
    this.validUrl = false;
    this.confirmPass = '';
    this.url = GLOBAL.url;
    this.user = new User('',null ,'','',null,'','','', null,'', false,'',[],'','','',false,'',false,true);
  }

  ngOnInit() {
    this.validateUrl();
    if(localStorage.getItem('identity') || localStorage.getItem('token')){
      localStorage.clear();
      location.reload()
    }
  }

  validateUrl(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];
      let passToken = params['passToken'];
      this._userService.validUser(id, passToken).subscribe(
        response =>{
            if(!response.user){
              this.validUrl = false;
            }else{
              this.user = response.user;
              this.title = '¡Hola '+this.user.name+'! recuperemos tu contraseña';
              this.validUrl = true;
            }
        },
        error =>{
          this.validUrl = false;
        }
      );
    })
  }

  onSubmit(){
    if(this.user.password != this.confirmPass){
      this.openSnackBar('La contraseña ingresada no coincide con la contraseña de confirmación', 'Cerrar');
    }else{
      this._userService.resetPass(this.user._id, this.user.passToken, this.confirmPass).subscribe(
        response =>{
            if(!response.user){
              this.openSnackBar('Hubo un problema en el servidor, contacte con el administrador', 'Cerrar');
            }else{
              this.openSnackBar('Contraseña modificada', 'Cerrar');
              window.location.href = '/home';
            }
        },
        error =>{
          this.openSnackBar(error.message, 'Cerrar');
        }
      );
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }
}
