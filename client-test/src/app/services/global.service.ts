import { Injectable, Pipe } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {GLOBAL} from './global'; // Hecho a mano
import { HttpClient, HttpHeaders } from '@angular/common/http';


//Inyeccion de dependencias
@Injectable()
export class globalService{
    
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

    getCountSearch(token, name, company){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'global/find-all/'+name+'/'+company, this.httpOptions);

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
