import { Injectable, Pipe } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import {GLOBAL} from './global'; // Hecho a mano
import {map} from 'rxjs/operators';
import {Team} from '../models/team';
import { cpus } from 'os';

//Inyeccion de dependencias
@Injectable()
export class teamService{
    
    public url: string; //url del api
    public identity;
    public token;

    constructor(private _http:Http){
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

    getList(token, company){
      let headers = new Headers({
          'Content-Type':'application/json',
          'Authorization':token
      });

      let options = new RequestOptions({headers: headers});
      return this._http.get(this.url+'team/teams/'+company, options)
                          .map(res => res.json());
    }

    getAgentsList(token, id, company:string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });
  
        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url+'team/agents/'+id+'/'+company, options)
                            .map(res => res.json());
      }

    getOne(token, id){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'team/team/'+id, options)
                            .map(res => res.json());
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
