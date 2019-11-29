import { Injectable, Pipe } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
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

    constructor(private _http:Http, private _httpClient: HttpClient){
        this.url = GLOBAL.url;
    }

    add(token, company: Company){
        let params = JSON.stringify(company);
        let headers = new Headers({
           'Content-Type':'application/json',
           'Authorization':token
        });

        return this._http.post(this.url+'company/add', params, {headers: headers})
                           .map(res => res.json());
    }

    edit(token, id:string, company: Company){
        let params = JSON.stringify(company);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'company/update/'+id, params, {headers: headers})
                            .map(res => res.json());
    }
    
    delete(token, id){
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });

          let options = new RequestOptions({headers: headers});
          return this._http.delete(this.url+'company/delete/'+id, options)
                            .map(res => res.json());
    }

    getList(token){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'company/companies', this.httpOptions);

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
