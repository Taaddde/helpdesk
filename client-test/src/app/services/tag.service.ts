import { Injectable, Pipe } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import {GLOBAL} from './global'; // Hecho a mano
import {map} from 'rxjs/operators';
import {Tag} from '../models/tag';
import { HttpClient, HttpHeaders } from '@angular/common/http';


//Inyeccion de dependencias
@Injectable()
export class tagService{
    
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

    add(token, tag: Tag){
        let params = JSON.stringify(tag);
        let headers = new Headers({
           'Content-Type':'application/json',
           'Authorization':token
        });

        return this._http.post(this.url+'tag/add', params, {headers: headers})
                           .map(res => res.json());
    }

    edit(token, id:string, tag: Tag){
        let params = JSON.stringify(tag);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'tag/update/'+id, params, {headers: headers})
                            .map(res => res.json());
    }
    
    delete(token, id){
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });

          let options = new RequestOptions({headers: headers});
          return this._http.delete(this.url+'tag/delete/'+id, options)
                            .map(res => res.json());
    }

    getList(token){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'tag/tags', this.httpOptions);
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'tag/tag/'+id, this.httpOptions);
    }

    getForName(token, i: string){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'tag/for-name/'+i, this.httpOptions);
    }

    

}
