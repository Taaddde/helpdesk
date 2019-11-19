import { Injectable, Pipe } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {GLOBAL} from './global'; // Hecho a mano

//Inyeccion de dependencias
@Injectable()
export class globalService{
    
    public url: string; //url del api
    public identity;
    public token;

    constructor(private _http:Http){
        this.url = GLOBAL.url;
    }

    getCountSearch(token, name, company){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'global/find-all/'+name+'/'+company, options)
                            .map(res => res.json());
    }    

    sendMail(token, mailOptions){
        let params = JSON.stringify(mailOptions);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          return this._http.post(this.url+'global/sendmail', params, {headers:headers})
                            .map(res => res.json());
    }   

}