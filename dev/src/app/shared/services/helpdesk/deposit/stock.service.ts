import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {GLOBAL} from '../global'; // Hecho a mano
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Stock } from 'app/shared/models/helpdesk/deposit/stock';


//Inyeccion de dependencias
@Injectable()
export class stockService{
    
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

    add(token, stock: Stock){
        let params = JSON.stringify(stock);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+'stock/add', params, this.httpOptions);

    }

    edit(token, id:string, stock: Stock){
        let params = JSON.stringify(stock);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'stock/update/'+id, params, this.httpOptions);

    }
    

    editMany(token, item:string, update){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'stock/update-many/'+item, update, this.httpOptions);

    }

    delete(token, id){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.delete<any>(this.url+'stock/delete/'+id, this.httpOptions);

    }

    deleteMany(token, query){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);
        let options = {
            headers: this.httpOptions.headers,
            params: query
        };

        
        return this._httpClient.delete<any>(this.url+'stock/delete', options);

    }

    getList(token, query){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);
            let options = {
                headers: this.httpOptions.headers,
                params: query
            };
        return this._httpClient.get<any>(this.url+'stock/list', options);
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'stock/get/'+id, this.httpOptions);
    }

}
