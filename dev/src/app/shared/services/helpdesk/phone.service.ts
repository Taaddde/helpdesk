import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


//Inyeccion de dependencias
@Injectable()
export class phoneService{
    
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

    add(phone){
        return this._httpClient.post<any>(this.url+'phone/add', phone, this.httpOptions);
    }

    edit(id:string, phone){
        return this._httpClient.put<any>(this.url+'phone/update/'+id, phone, this.httpOptions);
    }
    
    delete(id){
        return this._httpClient.delete<any>(this.url+'phone/delete/'+id, this.httpOptions);

    }

    getList(query){
        let options = {
            headers: this.httpOptions.headers,
            params: query
        };
        return this._httpClient.get<any>(this.url+'phone/list', options);
    }

    getOne(id){
        return this._httpClient.get<any>(this.url+'phone/get/'+id, this.httpOptions);
    }

}
