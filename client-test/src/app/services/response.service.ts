import { Injectable, Pipe } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import {GLOBAL} from './global'; // Hecho a mano
import {map} from 'rxjs/operators';
import {Response} from '../models/response';

//Inyeccion de dependencias
@Injectable()
export class responseService{
    
    public url: string; //url del api
    public identity;
    public token;

    constructor(private _http:Http){
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
      let headers = new Headers({
          'Content-Type':'application/json',
          'Authorization':token
      });

      let options = new RequestOptions({headers: headers});
      return this._http.get(this.url+'response/responses/'+userId, options)
                          .map(res => res.json());
    }

    getOne(token, id){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'response/response/'+id, options)
                            .map(res => res.json());
    }

    getForName(token, i: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'response/for-name/'+i, ({headers: headers}))
                            .map(res => res.json());
    }

    

}
