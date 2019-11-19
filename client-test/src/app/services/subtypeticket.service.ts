import { Injectable, Pipe } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import {GLOBAL} from './global'; // Hecho a mano
import {map} from 'rxjs/operators';
import {SubTypeTicket} from '../models/subtypeticket';

//Inyeccion de dependencias
@Injectable()
export class subTypeTicketService{
    
    public url: string; //url del api
    public identity;
    public token;

    constructor(private _http:Http){
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
      let headers = new Headers({
          'Content-Type':'application/json',
          'Authorization':token
      });

      let options = new RequestOptions({headers: headers});
      return this._http.get(this.url+'subtype-ticket/subtype-tickets/'+ticketId, options)
                          .map(res => res.json());
    }

    getOne(token, id){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'subtype-ticket/subtype-ticket/'+id, options)
                            .map(res => res.json());
    }

    getForName(token, i: string, typeId:string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'subtype-ticket/for-name/'+i+'/'+typeId, ({headers: headers}))
                            .map(res => res.json());
    }

    

}
