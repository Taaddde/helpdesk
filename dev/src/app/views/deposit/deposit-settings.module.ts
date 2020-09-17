import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DepositSettingsRoutes } from './deposit-settings.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(DepositSettingsRoutes)
  ],
  declarations: []
})
export class AppDepositSettingsModule { }