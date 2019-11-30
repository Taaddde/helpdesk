import { Injectable, Pipe } from '@angular/core';
import 'rxjs/add/operator/map';
import {GLOBAL} from './global'; // Hecho a mano
import { HttpClient, HttpHeaders } from '@angular/common/http';


//Inyeccion de dependencias
@Injectable()
export class userService{
    
    public url: string; //url del api
    public identity;
    public token;
    public httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'null'
        })
    }

    constructor(private _httpClient: HttpClient){
        this.url = GLOBAL.url;
    }

    login(user_to_login, gethash = null){
        if(gethash != null){
            user_to_login.gethash = gethash;
        }
        let json = JSON.stringify(user_to_login);
        let params = json;

        return this._httpClient.post<any>(this.url+'user/login', params, this.httpOptions);

    }
    
    add(token, user){
        let json = JSON.stringify(user);
        let params = json;

        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+'user/add', params, this.httpOptions);
    }

    edit(token, user){
        let json = JSON.stringify(user);
        let params = json;

        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'user/update/'+user._id, params, this.httpOptions);

    }

    delete(token, id){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.delete<any>(this.url+'user/delete/'+id, this.httpOptions);
    }

    forgotPassword(userName){
        return this._httpClient.put<any>(this.url+'user/forgot/'+userName, {}, this.httpOptions);
    }

    validUser(id, passToken){
        return this._httpClient.get<any>(this.url+'user/valid-passToken/'+id+'/'+passToken, this.httpOptions);
    }

    resetPass(id, passToken, password){
        return this._httpClient.put<any>(this.url+'user/reset-password/'+id+'/'+passToken, {password:password}, this.httpOptions);
    }

    getList(token){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'user/users', this.httpOptions);
    }

    getForName(token, company, name){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'user/for-name/'+company+'/'+name, this.httpOptions);
    }

    getReqForName(token, name){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'user/req-for-name/'+name, this.httpOptions);
    }

    getListAgents(token, company:string){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'user/users/'+company+'/ROLE_AGENT', this.httpOptions);
    }

    getListReq(token, company){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'user/users/'+company+'/ROLE_REQUESTER', this.httpOptions);
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'user/user/'+id, this.httpOptions);
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