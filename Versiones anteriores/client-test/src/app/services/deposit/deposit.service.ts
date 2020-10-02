import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {GLOBAL} from '../global'; // Hecho a mano
import {Deposit} from '../../models/deposit/deposit';
import { HttpClient, HttpHeaders } from '@angular/common/http';


//Inyeccion de dependencias
@Injectable()
export class depositService{
    
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

    add(token, deposit: Deposit){
        let params = JSON.stringify(deposit);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+'deposit/add', params, this.httpOptions);

    }

    edit(token, id:string, deposit: Deposit){
        let params = JSON.stringify(deposit);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'deposit/update/'+id, params, this.httpOptions);

    }
    
    delete(token, id){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.delete<any>(this.url+'deposit/delete/'+id, this.httpOptions);

    }

    getList(token){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'deposit/list', this.httpOptions);
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'deposit/get/'+id, this.httpOptions);
    }

}
