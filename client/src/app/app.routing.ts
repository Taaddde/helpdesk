import {ModuleWithProviders} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'
import { TicketListComponent } from './components/ticket-list/ticket-list.component';


const appRoutes: Routes = [
    //Redireccion
    //{path: '', redirectTo: 'home', pathMatch: 'full'},

    {path: 'ticket', component: TicketListComponent},

];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);