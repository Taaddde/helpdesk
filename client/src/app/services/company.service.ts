import { Injectable, Pipe } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {GLOBAL} from './global'; // Hecho a mano
import {Company} from '../models/company';

//Inyeccion de dependencias
@Injectable()
export class companyService{
    
    public url: string; //url del api
    public identity;
    public token;

    constructor(private _http:Http){
        this.url = GLOBAL.url;
    }

    add(token, company: Company){
        let params = JSON.stringify(company);
        let headers = new Headers({
           'Content-Type':'application/json',
           'Authorization':token
        });

        return this._http.post(this.url+'company/add', params, {headers: headers})
                           .map(res => res.json());
    }

    edit(token, id:string, company: Company){
        let params = JSON.stringify(company);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'company/update/'+id, params, {headers: headers})
                            .map(res => res.json());
    }
    
    delete(token, id){
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });

          let options = new RequestOptions({headers: headers});
          return this._http.delete(this.url+'company/delete/'+id, options)
                            .map(res => res.json());
    }

    getList(token){
      let headers = new Headers({
          'Content-Type':'application/json',
          'Authorization':token
      });

      let options = new RequestOptions({headers: headers});
      return this._http.get(this.url+'company/companies', options)
                          .map(res => res.json());
    }

    getForName(token, name){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
         });
 
         let options = new RequestOptions({headers: headers});
         return this._http.get(this.url+'company/for-name/'+name, options)
                            .map(res => res.json());
    }

    getOne(token, id){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'company/company/'+id, options)
                            .map(res => res.json());
    }    

}
