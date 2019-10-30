import { Injectable, Pipe } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import {GLOBAL} from './global'; // Hecho a mano
import {map} from 'rxjs/operators';
import {TextBlock} from '../models/textblock';

//Inyeccion de dependencias
@Injectable()
export class textblockService{
    
    public url: string; //url del api
    public identity;
    public token;

    constructor(private _http:Http){
        this.url = GLOBAL.url;
    }

    add(token, textblock: TextBlock){
        let params = JSON.stringify(textblock);
        let headers = new Headers({
           'Content-Type':'application/json',
           'Authorization':token
        });

        return this._http.post(this.url+'textblock/add', params, {headers: headers})
                           .map(res => res.json());
    }

    edit(token, id:string, textblock: TextBlock){
        let params = JSON.stringify(textblock);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'textblock/update/'+id, params, {headers: headers})
                            .map(res => res.json());
    }
    
    delete(token, id){
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });

          let options = new RequestOptions({headers: headers});
          return this._http.delete(this.url+'textblock/delete/'+id, options)
                            .map(res => res.json());
    }

    readAll(token, id){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'textblock/read/'+id, {read:true}, {headers: headers})
                            .map(res => res.json());
    }

    getList(token){
      let headers = new Headers({
          'Content-Type':'application/json',
          'Authorization':token
      });

      let options = new RequestOptions({headers: headers});
      return this._http.get(this.url+'textblock/textblocks', options)
                          .map(res => res.json());
    }

    getOne(token, id){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'textblock/textblock/'+id, options)
                            .map(res => res.json());
    }

    getForText(token, i: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'textblock/for-text/'+i, ({headers: headers}))
                            .map(res => res.json());
    }

    getForTicket(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'textblock/for-ticket/'+id, ({headers: headers}))
                            .map(res => res.json());
    }

    

}
