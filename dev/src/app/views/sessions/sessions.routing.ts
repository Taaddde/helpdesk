import { Signup4Component } from './signup4/signup4.component';
import { Signup3Component } from './signup3/signup3.component';
import { Signup2Component } from './signup2/signup2.component';
import { Routes } from "@angular/router";

import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LockscreenComponent } from "./lockscreen/lockscreen.component";
import { SigninComponent } from "./signin/signin.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ErrorComponent } from "./error/error.component";
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const SessionsRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "signin",
        component: SigninComponent,
        data: { title: "Login" }
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
        data: { title: "Olvide mi contraseña" }
      },
      {
        path: "reset-password/:id/:passToken",
        component: ResetPasswordComponent,
        data: { title: "Recuperar contraseña" }
      },
      {
        path: "lockscreen",
        component: LockscreenComponent,
        data: { title: "Lockscreen" }
      },
      {
        path: "404",
        component: NotFoundComponent,
        data: { title: "Not Found" }
      },
      {
        path: "error",
        component: ErrorComponent,
        data: { title: "Error" }
      }
    ]
  }
];
