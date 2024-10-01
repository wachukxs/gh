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
import { CallerService } from '../services/caller.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private callerService: CallerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Ignore if it's from login or sign up
    if ((request.url.endsWith('/login') || request.url.endsWith('/signup')) && request.method === "POST") {
      return next.handle(request);
    }

    // console.log('req', request);

    if (request instanceof HttpRequest) {
      const _token = sessionStorage.getItem('_online')
      if (_token) {
        let requestCopy = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${_token}`),
          withCredentials: true
        })

        return next.handle(requestCopy);
      }
      
    }
    
    return next.handle(request);
  }
}
