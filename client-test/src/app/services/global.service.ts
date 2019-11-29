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
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'global/find-all/'+name+'/'+company, options)
                            .map(res => res.json())
    }

    sendMail(token, mailOptions){
        let params = JSON.stringify(mailOptions);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+'global/sendmail', params, this.httpOptions);
    }   

}
