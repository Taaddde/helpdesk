import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


//Inyeccion de dependencias
@Injectable()
export class phonegroupService{
    
    public url: string; //url del api
    public identity;
    public token;
    public httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
    }

    constructor(private _httpClient: HttpClient){
        this.url = 'http://10.0.0.98:1000/api/';
    }

    add(phonegroup){
        return this._httpClient.post<any>(this.url+'phonegroup/add', phonegroup, this.httpOptions);
    }

    edit(id:string, phonegroup){
        return this._httpClient.put<any>(this.url+'phonegroup/update/'+id, phonegroup, this.httpOptions);
    }
    
    delete(id){
        return this._httpClient.delete<any>(this.url+'phonegroup/delete/'+id, this.httpOptions);

    }

    getList(query){
        let options = {
            headers: this.httpOptions.headers,
            params: query
        };
        return this._httpClient.get<any>(this.url+'phonegroup/list', options);
    }

    getOne(id){
        return this._httpClient.get<any>(this.url+'phonegroup/get/'+id, this.httpOptions);
    }

}
