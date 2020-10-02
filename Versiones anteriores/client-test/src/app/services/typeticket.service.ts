import { Injectable, Pipe } from '@angular/core';
import 'rxjs/add/operator/map';
import {GLOBAL} from './global'; // Hecho a mano
import {TypeTicket} from '../models/typeticket';
import { HttpClient, HttpHeaders } from '@angular/common/http';


//Inyeccion de dependencias
@Injectable()
export class typeTicketService{
    
    public url: string; //url del api
    public identity;
    public token;
    public httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'null'
        })
    }

    constructor(private _httpClient: HttpClient){
        this.url = GLOBAL.url;
    }

    add(token, typeTicket: TypeTicket){
        let params = JSON.stringify(typeTicket);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+'type-ticket/add', params, this.httpOptions);

    }

    edit(token, id:string, typeTicket: TypeTicket){
        let params = JSON.stringify(typeTicket);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'type-ticket/update/'+id, params, this.httpOptions);
    }
    
    delete(token, id){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.delete<any>(this.url+'type-ticket/delete/'+id, this.httpOptions);
    }

    getList(token, company:string){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'type-ticket/type-tickets/'+company, this.httpOptions);
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'type-ticket/type-ticket/'+id, this.httpOptions);
    }

    getForName(token, i: string, company:string){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'type-ticket/for-name/'+i+'/'+company, this.httpOptions);
    }

    

}
