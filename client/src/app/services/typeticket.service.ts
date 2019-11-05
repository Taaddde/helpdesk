import { Injectable, Pipe } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import {GLOBAL} from './global'; // Hecho a mano
import {map} from 'rxjs/operators';
import {TypeTicket} from '../models/typeticket';

//Inyeccion de dependencias
@Injectable()
export class typeTicketService{
    
    public url: string; //url del api
    public identity;
    public token;

    constructor(private _http:Http){
        this.url = GLOBAL.url;
    }

    add(token, typeTicket: TypeTicket){
        let params = JSON.stringify(typeTicket);
        let headers = new Headers({
           'Content-Type':'application/json',
           'Authorization':token
        });

        return this._http.post(this.url+'type-ticket/add', params, {headers: headers})
                           .map(res => res.json());
    }

    edit(token, id:string, typeTicket: TypeTicket){
        let params = JSON.stringify(typeTicket);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'type-ticket/update/'+id, params, {headers: headers})
                            .map(res => res.json());
    }
    
    delete(token, id){
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });

          let options = new RequestOptions({headers: headers});
          return this._http.delete(this.url+'type-ticket/delete/'+id, options)
                            .map(res => res.json());
    }

    getList(token, company:string){
      let headers = new Headers({
          'Content-Type':'application/json',
          'Authorization':token
      });

      let options = new RequestOptions({headers: headers});
      return this._http.get(this.url+'type-ticket/type-tickets/'+company, options)
                          .map(res => res.json());
    }

    getOne(token, id){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'type-ticket/type-ticket/'+id, options)
                            .map(res => res.json());
    }

    getForName(token, i: string, company:string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'type-ticket/for-name/'+i+'/'+company, ({headers: headers}))
                            .map(res => res.json());
    }

    

}
