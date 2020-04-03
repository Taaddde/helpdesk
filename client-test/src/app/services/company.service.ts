import { Injectable, Pipe } from '@angular/core';
import 'rxjs/add/operator/map';
import {GLOBAL} from './global'; // Hecho a mano
import {Company} from '../models/company';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//Inyeccion de dependencias
@Injectable()
export class companyService{
    
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

    add(token, company: Company){
        let params = JSON.stringify(company);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+'company/add', params, this.httpOptions);
    }

    edit(token, id:string, company: Company){
        let params = JSON.stringify(company);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'company/update/'+id, params, this.httpOptions);

    }
    
    delete(token, id){

        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.delete<any>(this.url+'company/delete/'+id, this.httpOptions);
    }

    getList(token){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'company/companies', this.httpOptions);

    }

    getListChat(token){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'company/companies/chat', this.httpOptions);

    }

    getForName(token, name){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'company/for-name/'+name, this.httpOptions);

    }


    getOne(token, id){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'company/company/'+id, this.httpOptions);

    }    

}
