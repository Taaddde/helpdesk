import { Injectable, Pipe } from '@angular/core';
import {GLOBAL} from './global'; // Hecho a mano
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


//Inyeccion de dependencias
@Injectable()
export class requestService{
    
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
    
    add(token, request){
        let json = JSON.stringify(request);
        let params = json;

        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+'request/add', params, this.httpOptions);
    }

    edit(token, request){
        let json = JSON.stringify(request);
        let params = json;

        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'request/update/'+request._id, params, this.httpOptions);

    }

    delete(token, id){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.delete<any>(this.url+'request/delete/'+id, this.httpOptions);
    }

    getList(token, query){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);
            
        var q = '';
        if(query.oldMax){
            q = q+'&oldMax='+query.oldMax;
        }
        if(query.oldMin){
          q = q+'&oldMin='+query.oldMin;
        }
        if(query.module){
            q = q+'&module='+query.module;
        }
        if(query.type){
            q = q+'&type='+query.type;
        }
        if(query.priority){
            q = q+'&priority='+query.priority;
        }
        if(query.environment){
            q = q+'&environment='+query.environment;
        }
        if(query.req){
            q = q+'&req='+query.req;
        }
        if(query.statusClient){
            q = q+'&statusClient='+query.statusClient;
        }
        if(query.statusEnterprise){
            q = q+'&statusEnterprise='+query.statusEnterprise;
        }
        if(query.num){
            q = q+'&num='+query.num;
        }
        if(query.environment){
            q = q+'&environment='+query.environment;
        }

    
        return this._httpClient.get<any>(this.url+'request/list/query?'+q, this.httpOptions);
    }

    getList_ModuleNames(token){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

            return this._httpClient.get<any>(this.url+'request/list/module/names', this.httpOptions);
    }

    getReports(token, environment, status, query:any){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);
        
        var q = '?environment='+environment+'&status='+status;
        if(query.oldMax){
            q = q+'&oldMax='+query.oldMax;
        }
        if(query.oldMin){
          q = q+'&oldMin='+query.oldMin;
        }
        if(query.module){
            q = q+'&module='+query.module;
        }
        if(query.type){
        q = q+'&type='+query.type;
        }
        if(query.priority){
        q = q+'&priority='+query.priority;
        }
      

        return this._httpClient.get<any>(this.url+'request/report'+q, this.httpOptions);
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'request/one/'+id, this.httpOptions);
    }
}