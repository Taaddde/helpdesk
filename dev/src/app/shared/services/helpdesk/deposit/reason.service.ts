import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {GLOBAL} from '../global'; // Hecho a mano
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reason } from 'app/shared/models/helpdesk/deposit/reason';


//Inyeccion de dependencias
@Injectable()
export class reasonService{
    
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

    add(token, reason: Reason){
        let params = JSON.stringify(reason);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+'reason/add', params, this.httpOptions);

    }

    edit(token, id:string, reason: Reason){
        let params = JSON.stringify(reason);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'reason/update/'+id, params, this.httpOptions);

    }
    
    delete(token, id){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.delete<any>(this.url+'reason/delete/'+id, this.httpOptions);

    }

    getList(token, query){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);
            let options = {
                headers: this.httpOptions.headers,
                params: query
            };
        return this._httpClient.get<any>(this.url+'reason/list', options);
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'reason/get/'+id, this.httpOptions);
    }

}
