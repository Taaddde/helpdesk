import {ModuleWithProviders} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'


const appRoutes: Routes = [
    //Redireccion
    //{path: '', redirectTo: 'home', pathMatch: 'full'},

 //   {path: 'movimientos', component: ViewMovimComponent},

];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);