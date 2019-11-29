import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';


@Injectable()
export class MyHttpInterceptor implements HttpInterceptor{
    
    count = 0;

    constructor(private spinner: NgxSpinnerService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.spinner.show()
        this.count++;
        return next.handle(req)
            .pipe ( tap (), finalize(() => {
                    this.count--;
                    if ( this.count == 0 ) this.spinner.hide ()
                })
            );
    }
}
