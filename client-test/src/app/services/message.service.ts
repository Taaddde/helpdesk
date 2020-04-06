import { Injectable, Pipe } from '@angular/core';
import 'rxjs/add/operator/map';
import {GLOBAL} from './global'; // Hecho a mano
import {Message} from '../models/message';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Http, Headers, RequestOptions} from '@angular/http';



//Inyeccion de dependencias
@Injectable()
export class messageService{
    
    public url: string; //url del api
    public identity;
    public token;
    public httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'null'
        })
    }

    constructor(private _http:Http, private _httpClient: HttpClient){
        this.url = GLOBAL.url;
    }

    add(token, message: Message){
        let params = JSON.stringify(message);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+'message/add', params, this.httpOptions);

    }

    edit(token, id:string, message: Message){
        let params = JSON.stringify(message);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'message/update/'+id, params, this.httpOptions);

    }

    read(token, chat: string){
        let params = JSON.stringify({readed:true});
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'message/read/'+chat, params, this.httpOptions);

    }
    
    delete(token, id){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.delete<any>(this.url+'message/delete/'+id, this.httpOptions);

    }

    getList(token, chat){

        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'message/list/'+chat, options)
                            .map(res => res.json())
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'message/one/'+id, this.httpOptions);
    }

}
