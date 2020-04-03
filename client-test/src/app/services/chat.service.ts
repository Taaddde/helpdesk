import { Injectable, Pipe } from '@angular/core';
import 'rxjs/add/operator/map';
import {GLOBAL} from './global'; // Hecho a mano
import {Chat} from '../models/chat';
import { HttpClient, HttpHeaders } from '@angular/common/http';


//Inyeccion de dependencias
@Injectable()
export class chatService{
    
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

    add(token, chat: any){
        let params = JSON.stringify(chat);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+'chat/add', params, this.httpOptions);

    }

    edit(token, id:string, chat: Chat){
        let params = JSON.stringify(chat);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'chat/update/'+id, params, this.httpOptions);

    }
    
    delete(token, id){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.delete<any>(this.url+'chat/delete/'+id, this.httpOptions);

    }

    getList(token, page, perPage){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'chat/list/paged/'+page+'/'+perPage, this.httpOptions);
    }

    getMyChats(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'chat/list/mychats/'+id, this.httpOptions);
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'chat/one/'+id, this.httpOptions);
    }

    getTeamList(token, userId){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);
        console.log(this.url+'chat/list/team/'+userId,);
        return this._httpClient.get<any>(this.url+'chat/list/team/'+userId, this.httpOptions);
    }


}
