import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {GLOBAL} from '../global'; // Hecho a mano
import {Stock} from '../../models/deposit/stock';
import { HttpClient, HttpHeaders } from '@angular/common/http';


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
    
    delete(token, id){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.delete<any>(this.url+'stock/delete/'+id, this.httpOptions);

    }

    getList(token){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'stock/list', this.httpOptions);
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'stock/get/'+id, this.httpOptions);
    }

}
