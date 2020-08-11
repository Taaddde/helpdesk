import { Injectable, Pipe } from '@angular/core';
import 'rxjs/add/operator/map';
import {GLOBAL} from './global'; // Hecho a mano
import {WorkObservation} from '../models/workobservation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Http, Headers, RequestOptions} from '@angular/http';



//Inyeccion de dependencias
@Injectable()
export class workObservationService{
    
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

    add(token, workObservation: WorkObservation){
        let params = JSON.stringify(workObservation);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+'workObservation/add', params, this.httpOptions);

    }

    edit(token, id:string, workObservation: WorkObservation){
        let params = JSON.stringify(workObservation);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'workObservation/update/'+id, params, this.httpOptions);

    }
    
    delete(token, id){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.delete<any>(this.url+'workObservation/delete/'+id, this.httpOptions);

    }

    getList(token, id){

        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'workObservation/list/'+id, options)
                            .map(res => res.json())
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'workobservation/one/'+id, this.httpOptions);
    }

    read(token, idWork){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'textblock/read/'+idWork, {read:true}, this.httpOptions);
    }

}
