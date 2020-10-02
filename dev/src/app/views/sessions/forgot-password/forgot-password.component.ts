import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GLOBAL } from 'app/shared/services/helpdesk/global';
import { userService } from 'app/shared/services/helpdesk/user.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [userService]
})
export class ForgotPasswordComponent implements OnInit {
  public forgotUserName: string;
  public url: string;

  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  constructor(
    private _userService: userService,
    private snackBar: MatSnackBar,
  ) { 
    this.url = GLOBAL.url;  
    this.forgotUserName = '';  

  }

  ngOnInit() {
  }
  submitEmail() {
    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';
    this._userService.forgotPassword(this.forgotUserName).subscribe(
      response =>{
          if(!response.mail){
            this.openSnackBar("Nombre de usuario o email inválido", "Cerrar");
            this.submitButton.disabled = false;
            this.progressBar.mode = 'determinate';        
          }else{
            this.openSnackBar("Se envió el correo de restablecimiento", "Cerrar");
            this.forgotUserName = '';
            this.submitButton.disabled = false;
            this.progressBar.mode = 'determinate';        
          }
      },
      error =>{
          this.openSnackBar(error.message, 'Cerrar');
          this.submitButton.disabled = false;
          this.progressBar.mode = 'determinate';      
      }
    );
  }

  onSubmit(){
    
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }
}
