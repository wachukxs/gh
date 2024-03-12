import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpStatusCode
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Router, UrlTree } from '@angular/router';
import { CallerService } from './services/caller.service';

@Injectable()
export class BaseInterceptorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private callerService: CallerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request instanceof HttpResponse) {
      request.status === HttpStatusCode.Unauthorized
      // route to login
      this.callerService.showNotification("Session Expired. Login.", undefined, "OK" , "bottom")
      console.log('auth route to login...');
      
      this.router.navigate(['/login']) // TODO: is this okay to do? should it be in a route guard instead?

      return EMPTY // stop request.
    }
    // Is an over kill... 
    let requestCopy = request.clone({withCredentials: true})
    
    return next.handle(requestCopy);
  }
}
