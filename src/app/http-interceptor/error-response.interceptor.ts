import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CallerService } from '../services/caller.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorResponseInterceptor implements HttpInterceptor {

  constructor(private router: Router, private callerService: CallerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // return next.handle(request);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          // route to login
          this.callerService.showNotification("Unauthorized. Please login to continue.", undefined, "OK" , "bottom")
          console.log('auth route to login...');
          
          this.router.navigate(['/login']) // TODO: is this okay to do? should it be in a route guard instead?
  
          // return EMPTY // stop request.
        }

        return throwError(error); // need it for method response type (TS)
      })
    );
  }
}
