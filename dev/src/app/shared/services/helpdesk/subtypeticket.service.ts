import { Injectable, Pipe } from '@angular/core';
import 'rxjs/add/operator/map';
import {GLOBAL} from './global'; // Hecho a mano
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SubTypeTicket } from 'app/shared/models/helpdesk/subtypeticket';


//Inyeccion de dependencias
@Injectable()
export class subTypeTicketService{
    
    public url: string; //url del api
    public identity;
    public token;
    public httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'null'
        }),
    }

    constructor(private _httpClient: HttpClient){
        this.url = GLOBAL.url;
    }

    add(token, subTypeTicket: SubTypeTicket){
        let params = JSON.stringify(subTypeTicket);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+'subtype-ticket/add', params, this.httpOptions);

    }

    edit(token, id:string, subTypeTicket: SubTypeTicket){
        let params = JSON.stringify(subTypeTicket);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'subtype-ticket/update/'+id, params, this.httpOptions);

    }

    goodCheck(token, id:string){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'subtype-ticket/goodcheck/'+id,{}, this.httpOptions);
    }


    addCheck(token, id:string, check:string){
        let params = {check:check};
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'subtype-ticket/add-check/'+id, params, this.httpOptions);
    }
    
    delete(token, id){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.delete<any>(this.url+'subtype-ticket/delete/'+id, this.httpOptions);

    }

    deleteCheck(token, id, check){
        let params = {check:check};
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);
        let options = {
            headers: this.httpOptions.headers,
            body: {
                check:check
            },
        };


        return this._httpClient.put<any>(this.url+'subtype-ticket/delete-check/'+id, params, options);
    }

    getList(token, ticketId:string){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'subtype-ticket/subtype-tickets/'+ticketId, this.httpOptions);
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'subtype-ticket/subtype-ticket/'+id, this.httpOptions);
    }

    getForName(token, i: string, typeId:string){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'subtype-ticket/for-name/'+i+'/'+typeId, this.httpOptions);
    }

    

}
