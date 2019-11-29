import { Injectable, Pipe } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import {GLOBAL} from './global'; // Hecho a mano
import {map} from 'rxjs/operators';
import {SubTypeTicket} from '../models/subtypeticket';
import { HttpClient, HttpHeaders } from '@angular/common/http';


//Inyeccion de dependencias
@Injectable()
export class subTypeTicketService{
    
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

    add(token, subTypeTicket: SubTypeTicket){
        let params = JSON.stringify(subTypeTicket);
        let headers = new Headers({
           'Content-Type':'application/json',
           'Authorization':token
        });

        return this._http.post(this.url+'subtype-ticket/add', params, {headers: headers})
                           .map(res => res.json());
    }

    edit(token, id:string, subTypeTicket: SubTypeTicket){
        let params = JSON.stringify(subTypeTicket);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'subtype-ticket/update/'+id, params, {headers: headers})
                            .map(res => res.json());
    }

    goodCheck(token, id:string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'subtype-ticket/goodcheck/'+id,{}, {headers: headers})
                            .map(res => res.json());
    }


    addCheck(token, id:string, check:string){
        let params = {check:check};
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'subtype-ticket/add-check/'+id, params, {headers: headers})
                            .map(res => res.json());
    }
    
    delete(token, id){
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });

          let options = new RequestOptions({headers: headers});
          return this._http.delete(this.url+'subtype-ticket/delete/'+id, options)
                            .map(res => res.json());
    }

    deleteCheck(token, id, check){
        let params = {check:check};
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

        let options = {
            headers: headers,
            body: {
                check:check
            },
        };
              return this._http.delete(this.url+'subtype-ticket/delete-check/'+id, options)
                                .map(res => res.json());
    }

    getList(token, ticketId:string){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'subtype-ticket/subtype-tickets/'+ticketId, this.httpOptions);
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'subtype-ticket/subtype-ticket/'+id, this.httpOptions);
    }

    getForName(token, i: string, typeId:string){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'subtype-ticket/for-name/'+i+'/'+typeId, this.httpOptions);
    }

    

}
