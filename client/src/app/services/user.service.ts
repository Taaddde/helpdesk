import { Injectable, Pipe } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/observable';
import {GLOBAL} from './global'; // Hecho a mano
import {map} from 'rxjs/operators';

//Inyeccion de dependencias
@Injectable()
export class userService{
    
    public url: string; //url del api
    public identity;
    public token;

    constructor(private _http:Http){
        this.url = GLOBAL.url;
    }

    login(user_to_login, gethash = null){
        if(gethash != null){
            user_to_login.gethash = gethash;
        }
        let json = JSON.stringify(user_to_login);
        let params = json;

        let headers = new Headers({'Content-Type': 'application/json'});

        return this._http.post(this.url+'user/login', params, {headers: headers})
                        .map(res=>res.json());
    }
    
    add(user){
        let json = JSON.stringify(user);
        let params = json;

        let headers = new Headers({'Content-Type': 'application/json'});

        return this._http.post(this.url+'user/add', params, {headers: headers})
                        .map(res=>res.json());
    }

    edit(user){
        let json = JSON.stringify(user);
        let params = json;

        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.getToken()
        });

        return this._http.put(this.url+'user/update/'+user._id, params, {headers: headers})
                        .map(res=>res.json());
    }

    getList(token){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
         });
 
         let options = new RequestOptions({headers: headers});
         return this._http.get(this.url+'user/users', options)
                            .map(res => res.json());
    }

    getListAgents(token, company:string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
         });
 
         let options = new RequestOptions({headers: headers});
         return this._http.get(this.url+'user/users/'+company+'/ROLE_AGENT', options)
                            .map(res => res.json());
    }

    getListReq(token){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
         });
 
         let options = new RequestOptions({headers: headers});
         return this._http.get(this.url+'user/users/ROLE_REQUESTER', options)
                            .map(res => res.json());
    }

    getOne(token, id){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
         });
 
         let options = new RequestOptions({headers: headers});
         return this._http.get(this.url+'user/user/'+id, options)
                            .map(res => res.json());
    }

    delete(token, id){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
         });
     
             let options = new RequestOptions({headers: headers});
             return this._http.delete(this.url+'user/delete/'+id,{headers: headers})
                                .map(res => res.json());
    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));
        if(identity != "undefined"){
            this.identity = identity;
        }else{
            this.identity = null;
        }

        return this.identity;
    }

    getToken(){
        let token = localStorage.getItem('token');

        if(token != "undefined"){
            this.token = token;
        }else{
            this.token = null;
        }

        return this.token;
    }
}