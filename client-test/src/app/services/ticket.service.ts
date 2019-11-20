import { Injectable, Pipe } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import {GLOBAL} from './global'; // Hecho a mano
import {map} from 'rxjs/operators';
import {Ticket} from '../models/ticket';

//Inyeccion de dependencias
@Injectable()
export class ticketService{
    
    public url: string; //url del api
    public identity;
    public token;

    constructor(private _http:Http){
        this.url = GLOBAL.url;
    }

    add(token, ticket: Ticket){
        let params = JSON.stringify(ticket);
        let headers = new Headers({
           'Content-Type':'application/json',
           'Authorization':token
        });

        return this._http.post(this.url+'ticket/add', params, {headers: headers})
                           .map(res => res.json());
    }

    edit(token, id:string, ticket: Ticket){
        let params = JSON.stringify(ticket);
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'ticket/update/'+id, params, {headers: headers})
                            .map(res => res.json());
    }
    
    delete(token, id){
      let headers = new Headers({
        'Content-Type':'application/json',
        'Authorization':token
      });

          let options = new RequestOptions({headers: headers});
          return this._http.delete(this.url+'ticket/delete/'+id, options)
                            .map(res => res.json());
    }

    getList(token){
      let headers = new Headers({
          'Content-Type':'application/json',
          'Authorization':token
      });

      let options = new RequestOptions({headers: headers});
      return this._http.get(this.url+'ticket/tickets', options)
                          .map(res => res.json());
    }

    getCalendar(token, id){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });
  
        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url+'ticket/calendar/'+id, options)
                            .map(res => res.json());
      }

    getPaginatedList(token, page, perPage, company, status, userId){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });
  
        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url+'ticket/ticketsPaged/'+page+'&'+perPage+'&'+company+'&'+status+'&'+userId, options)
                            .map(res => res.json());
    }

    getPaginatedReqList(token, page, perPage, userId, status){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
        });
  
        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url+'ticket/reqTicketsPaged/'+page+'&'+perPage+'&'+userId+'&'+status, options)
                            .map(res => res.json());
    }

    getOne(token, id){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'ticket/ticket/'+id, options)
                            .map(res => res.json());
    }

    getForNumber(token, i: number){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'ticket/for-number/'+i, ({headers: headers}))
                            .map(res => res.json());
    }

    getForName(token, company, name){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'ticket/for-name/'+company+'/'+name, ({headers: headers}))
                            .map(res => res.json());
    }


    getForUser(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'ticket/for-user/'+id, ({headers: headers}))
                            .map(res => res.json());
    }

    getCountsTickets(token,company:string, id:string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'ticket/counts-agent/'+company+'/'+id, ({headers: headers}))
                            .map(res => res.json());
    }

    getReqCountsTickets(token, id:string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'ticket/counts-requester/'+id, ({headers: headers}))
                            .map(res => res.json());
    }


    getReports(token, company:string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          return this._http.get(this.url+'ticket/report/'+company, ({headers: headers}))
                            .map(res => res.json());
    }

    getMessages(token, id:string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'ticket/unread/'+id, ({headers: headers}))
                            .map(res => res.json());
    }

    getMessagesReq(token, id:string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization':token
          });

          let options = new RequestOptions({headers: headers});
          return this._http.get(this.url+'ticket/req-unread/'+id, ({headers: headers}))
                            .map(res => res.json());
    }


}
