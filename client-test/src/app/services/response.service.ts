import { Injectable, Pipe } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import {GLOBAL} from './global'; // Hecho a mano
import {map} from 'rxjs/operators';
import {Response} from '../models/response';
import { HttpClient, HttpHeaders } from '@angular/common/http';


//Inyeccion de dependencias
@Injectable()
export class responseService{
    
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

    add(token, response: Response){
        let params = JSON.stringify(response);
        let headers = new Headers({
           'Content-Type':'application/json',
           'Authorization':token
        });

        return this._http.post(this.url+'response/add', params, {headers: headers})
                           .map(res => res.json());
    }

    edit(token, id:string, response: Response){
        let params = JSON.stringify(response);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'response/update/'+id, params, {headers: headers})
                            .map(res => res.json());
    }
    
    delete(token, id){
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });

          let options = new RequestOptions({headers: headers});
          return this._http.delete(this.url+'response/delete/'+id, options)
                            .map(res => res.json());
    }

    getList(token, userId:string){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'response/responses/'+userId, this.httpOptions);
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'response/response/'+id, this.httpOptions);
    }

    getForName(token, i: string){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'response/for-name/'+i, this.httpOptions);
    }

    

}
