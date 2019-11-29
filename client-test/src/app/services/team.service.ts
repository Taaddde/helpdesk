import { Injectable, Pipe } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import {GLOBAL} from './global'; // Hecho a mano
import {map} from 'rxjs/operators';
import {Team} from '../models/team';
import { HttpClient, HttpHeaders } from '@angular/common/http';


//Inyeccion de dependencias
@Injectable()
export class teamService{
    
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

    add(token, team: Team){
        let params = JSON.stringify(team);
        let headers = new Headers({
           'Content-Type':'application/json',
           'Authorization':token
        });

        return this._http.post(this.url+'team/add', params, {headers: headers})
                           .map(res => res.json());
    }

    edit(token, id:string, team: Team){
        let params = JSON.stringify(team);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'team/update/'+id, params, {headers: headers})
                            .map(res => res.json());
    }
    
    delete(token, id){
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });

          let options = new RequestOptions({headers: headers});
          return this._http.delete(this.url+'team/delete/'+id, options)
                            .map(res => res.json());
    }

    getForName(token, company, name){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'team/for-name/'+company+'/'+name, this.httpOptions);
    }


    getList(token, company){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'team/teams/'+company, this.httpOptions);
    }

    getAgentsList(token, id, company:string){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'team/agents/'+id+'/'+company, this.httpOptions);
      }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'team/team/'+id, this.httpOptions);
    }

    addUser(token, id:string, userId: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        var params = {user:userId};
        return this._http.put(this.url+'team/add-user/'+id, params, {headers: headers})
                            .map(res => res.json());
    }

    removeUser(token, id:string, userId: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'team/remove-user/'+id, {user:userId}, {headers: headers})
                            .map(res => res.json());
    }
    

}
