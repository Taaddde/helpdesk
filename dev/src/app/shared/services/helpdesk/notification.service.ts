import { Injectable, Pipe } from '@angular/core';
import 'rxjs/add/operator/map';
import {GLOBAL} from './global'; // Hecho a mano
import { HttpClient, HttpHeaders } from '@angular/common/http';


//Inyeccion de dependencias
@Injectable()
export class notificationService{
    
    public url: string; //url del api
    public path: string;
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
        this.path = 'notification'
    }

    add(token, notification){
        let params = JSON.stringify(notification);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+this.path+'/add', params, this.httpOptions);

    }

    edit(token, id:string, notification){
        let params = JSON.stringify(notification);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+this.path+'/update/'+id, params, this.httpOptions);

    }
    
    delete(token, id){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.delete<any>(this.url+this.path+'/delete/'+id, this.httpOptions);

    }

    getList(token, query){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);
            let options = {
                headers: this.httpOptions.headers,
                params: query
            };
        return this._httpClient.get<any>(this.url+this.path+'/list', options);
    }

    getCount(token, query){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);
            let options = {
                headers: this.httpOptions.headers,
                params: query
            };

        return this._httpClient.get<any>(this.url+this.path+'/count', options);
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+this.path+'/get/'+id, this.httpOptions);
    }
    

}
