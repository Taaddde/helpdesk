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
        console.log('Hola')
        this.spinner.show()

        this.count++;

        return next.handle(req)

            .pipe ( tap (

                    event => console.log(event),

                    error => console.log( error )

                ), finalize(() => {

                    this.count--;

                    if ( this.count == 0 ) this.spinner.hide ()
                })
            );
    }
}
