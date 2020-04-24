import { Injectable, Pipe } from '@angular/core';
import 'rxjs/add/operator/map';
import {GLOBAL} from './global'; // Hecho a mano
import {Work} from '../models/work';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Http, Headers, RequestOptions} from '@angular/http';



//Inyeccion de dependencias
@Injectable()
export class workService{
    
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

    add(token, work: Work, isRepeat, repeat){
        let params = JSON.stringify([work, isRepeat, repeat]);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+'work/add', params, this.httpOptions);

    }

    edit(token, id:string, work: any){
        let params = JSON.stringify(work);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'work/update/'+id, params, this.httpOptions);

    }
    
    delete(token, id){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.delete<any>(this.url+'work/delete/'+id, this.httpOptions);

    }

    getList(token, id){

        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'work/list/'+id, options)
                            .map(res => res.json())
    }

    getFinishList(token, id){

        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'work/list-finish/'+id, options)
                            .map(res => res.json())
    }

    getFreeList(token, id){

        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'work/list-free/'+id, options)
                            .map(res => res.json())
    }

    getCount(token, id){

        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'work/count/'+id, options)
                            .map(res => res.json())
    }


    getCalendar(token, id){

        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'work/calendar/'+id, options)
                            .map(res => res.json())
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'work/one/'+id, this.httpOptions);
    }

}
