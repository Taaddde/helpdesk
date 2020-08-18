import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { userService } from 'app/shared/services/helpdesk/user.service';
import { User } from 'app/shared/models/helpdesk/user';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [userService]
})
export class SigninComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;

  signinForm: FormGroup;
  errorMsg = '';
  return: string;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _userService: userService,
    private snackBar: MatSnackBar
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.signinForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(true)
    });

    this.route.queryParams
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => this.return = params['return'] || '/');
  }

  ngAfterViewInit() {
    this.autoSignIn();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  signin() {
    let user = new User('',null ,'','',null,'','','',null,'', false,'','','','',false,'',false,true);
    user.userName = this.signinForm.value['userName'];
    user.password = this.signinForm.value['password'];

    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';
    // this.router.navigateByUrl('/prefacturacion');


    this._userService.login(user).subscribe(
      response =>{
        let identity = response.user;

        if(!identity._id){
          this.openSnackBar('El usuario no esta correctamente identificado', 'Cerrar');
          this.submitButton.disabled = false;
          this.progressBar.mode = 'determinate';
        }else{
          localStorage.setItem('identity', JSON.stringify(identity));

          // Conseguir el token para enviarselo a cada peticion http
          this._userService.login(user, 'true').subscribe(
            response =>{
              let token = response.token;
              if(token.lenght <= 0){
                this.submitButton.disabled = false;
                this.progressBar.mode = 'determinate';
                this.openSnackBar('El token no se ha generado correctamente', 'Cerrar')
              }else{
                // Crear elemento en el localstorage para tener el token en sesion
                localStorage.setItem('token', token);
                user = new User('',null ,'','',null,'','','', null,'', false,'','','','',false,'',false,true);
                this.router.navigateByUrl('/home');
                //window.location.href='http://'+window.location.hostname+':'+window.location.port+'/home'
              }
            },
            error =>{
              this.submitButton.disabled = false;
              this.progressBar.mode = 'determinate';
              this.openSnackBar('Credenciales incorrecta, revise si su usuario y/o contraseña es correcto', 'Cerrar')
            }
          )          
        }   
      },
      error =>{
        this.submitButton.disabled = false;
        this.progressBar.mode = 'determinate';
        this.openSnackBar('Credenciales incorrecta, revise si su usuario y/o contraseña es correcto', 'Cerrar')
      }
    )

  }

  autoSignIn() {
    if(this._userService.getIdentity() && this._userService.getToken()){
      this.router.navigateByUrl('/tracking/analytics');
    }
  }

}
