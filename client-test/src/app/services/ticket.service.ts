import { Injectable, Pipe } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {GLOBAL} from './global'; // Hecho a mano
import {Ticket} from '../models/ticket';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';

//Inyeccion de dependencias
@Injectable()
export class ticketService{
    
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

    add(token, ticket: Ticket){
        let params = JSON.stringify(ticket);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);
        console.log(ticket)

        return this._httpClient.post<any>(this.url+'ticket/add', params, this.httpOptions);
    }

    sendMail(token, name, ticket: Ticket, text, nameTo, mailTo, link:string, cc:string[]){
        var sub = 'Novedades en el ticket #'+ticket.numTicket+' - '+ticket.sub;
        var txt = '<div style="position: relative;display: flex;flex-direction: column;min-width: 0;word-wrap: break-word;background-color: #fff;background-clip: border-box;border: 1px solid #e3e6f0;border-radius: .35rem;font-family: Nunito,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;"><div style="flex: 1 1 auto;padding: 1.25rem;"><h4 style="margin-bottom: .75rem;"><strong>¡Hola '+nameTo+'! Hay novedades en el ticket #'+ticket.numTicket+'</strong></h4><hr/><h6 style="color: #858796!important;margin-bottom: .5rem!important;margin-bottom: 0;margin-top: 9px;font-size: 1rem;margin-bottom: .5rem;font-weight: 400;line-height: 1.2;">'+name+'</h6><p class="card-text">'+text+'</p><hr /><a style="" href="'+link+'" role="button" >Ingresar al ticket</a></div></div>'
        var params = {company:ticket.company['_id'], to:mailTo, cc:cc, sub:sub, txt:txt}

        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.post<any>(this.url+'global/sendmail', params, this.httpOptions);
 
    }

    edit(token, id:string, ticket: Ticket){
        let params = JSON.stringify(ticket);
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'ticket/update/'+id, params, this.httpOptions);

    }

    unify(token, tickets){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'ticket/unify/', {tickets:tickets}, this.httpOptions);

    }

    addCc(token, id:string, cc: string){
        let params = {user:cc};
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'ticket/addcc/'+id, params, this.httpOptions);

    }

    removecc(token, id:string, cc: string){
        let params = {user:cc};
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'ticket/removecc/'+id, params, this.httpOptions);

    }



    checkClose(token){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.put<any>(this.url+'ticket/checkclose', {}, this.httpOptions);
    }
    
    delete(token, id){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.delete<any>(this.url+'ticket/delete/'+id, this.httpOptions);
    }

    getList(token){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/tickets', this.httpOptions);
    }

    getCalendar(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/calendar/'+id, this.httpOptions);
    }

    getPaginatedList(token, page, perPage, company, status, userId){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/ticketsPaged/'+page+'&'+perPage+'&'+company+'&'+status+'&'+userId, this.httpOptions);
    }

    getTmpPaginatedList(token, page, perPage, query, company, requester){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

            var q = [];
            for (var p in query) {
                if (query.hasOwnProperty(p)) {
                    q.push(encodeURIComponent(p) + "=" + encodeURIComponent(query[p]));
                  }
            }

            var t = '';
            if(company){
                t = '&company='+company
            }
            if(requester){
                t = t+'&requester='+requester
            }
        return this._httpClient.get<any>(this.url+'ticket/listPaged/'+page+'/'+perPage+'/?'+q.join('&')+t, this.httpOptions);
    }


    getPaginatedTeamList(token, page, perPage, userId){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/teamPaged/'+page+'/'+perPage+'/'+userId, this.httpOptions);
    }


    getPaginatedReqList(token, page, perPage, userId, status){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/reqTicketsPaged/'+page+'&'+perPage+'&'+userId+'&'+status, this.httpOptions);
    }

    getOne(token, id){
        this.httpOptions.headers =
            this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/ticket/'+id, this.httpOptions);
    }

    getForNumber(token, i: number){

        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/for-number/'+i, this.httpOptions);
    }

    getForName(token, company, name){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/for-name/'+company+'/'+name, this.httpOptions);
    }


    getForUser(token, id: string){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/for-user/'+id, this.httpOptions);

    }

    getCountsTickets(token,company:string, id:string){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/counts-agent/'+company+'/'+id, this.httpOptions);

    }

    getReqCountsTickets(token, id:string){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/counts-requester/'+id, this.httpOptions);

    }

    getReports(token, company:string){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/report/'+company, this.httpOptions);
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
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/req-unread/'+id, this.httpOptions);

    }

    getTimeWorkRep(token, companyId:string){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/timework/report/'+companyId, this.httpOptions);

    }

    getTimeWorkForSubtype(token, subTypeId:string, time:number, page:number){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/timework/for-subtype/'+subTypeId+'/'+time+'/'+page, this.httpOptions);

    }

    getTimeWorkPhase(token, subTypeId:string){
        this.httpOptions.headers =
        this.httpOptions.headers.set('Authorization', token);

        return this._httpClient.get<any>(this.url+'ticket/timework/phases/'+subTypeId, this.httpOptions);

    }



}
