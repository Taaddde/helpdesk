import { Injectable, Pipe } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import {GLOBAL} from './global'; // Hecho a mano
import {map} from 'rxjs/operators';
import {Ticket} from '../models/ticket';

//Inyeccion de dependencias
@Injectable()
export class ticketService{
    
    public url: string; //url del api
    public identity;
    public token;

    constructor(private _http:Http){
        this.url = GLOBAL.url;
    }

    add(token, ticket: Ticket){
        let params = JSON.stringify(ticket);
        let headers = new Headers({
           'Content-Type':'application/json',
           'Authorization':token
        });

        return this._http.post(this.url+'ticket/add', params, {headers: headers})
                           .map(res => res.json());
    }

    edit(token, id:string, ticket: Ticket){
        let params = JSON.stringify(ticket);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'ticket/update/'+id, params, {headers: headers})
                            .map(res => res.json());
    }
    
    delete(token, id){
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });

          let options = new RequestOptions({headers: headers});
          return this._http.delete(this.url+'ticket/delete/'+id, options)
                            .map(res => res.json());
    }

    getList(token){
      let headers = new Headers({
          'Content-Type':'application/json',
          'Authorization':token
      });

      let options = new RequestOptions({headers: headers});
      return this._http.get(this.url+'ticket/tickets', options)
                          .map(res => res.json());
    }

    getOne(token, id){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'ticket/ticket/'+id, options)
                            .map(res => res.json());
    }

    getForNumber(token, i: number){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'ticket/for-number/'+i, ({headers: headers}))
                            .map(res => res.json());
    }

    

}
