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
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class ErrorResponseInterceptor implements HttpInterceptor {

  constructor(private router: Router, private callerService: CallerService, private dialog: MatDialog) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // return next.handle(request);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        
        // Ignore if it's from login or sign up
        if ((request.url.endsWith('/login') || request.url.endsWith('/signup')) && request.method === "POST") {
          return next.handle(request);
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          // route to login
          this.callerService.showNotification("Unauthorized. Please login to continue.", undefined, "OK" , "bottom")
          console.log('auth route to login...');
          
          // close all open dialogs if any.
          this.dialog.closeAll()
          this.router.navigate(['/login']) // TODO: is this okay to do? should it be in a route guard instead?
  
          return EMPTY // stop request.
        }

        return throwError(error); // need it for method response type (TS)
      })
    );
  }
}
