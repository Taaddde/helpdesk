import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from '../global';


//Inyeccion de dependencias
@Injectable()
export class orderService{
    
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
        this.path = 'order'
    }

    add(token, order){
        let params = JSON.stringify(order);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+this.path+'/add', params, this.httpOptions);

    }

    edit(token, id:string, order){
        let params = JSON.stringify(order);
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

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+this.path+'/get/'+id, this.httpOptions);
    }
    

}
