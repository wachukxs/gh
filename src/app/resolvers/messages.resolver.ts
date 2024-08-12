import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { CallerService } from '../services/caller.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagesResolver implements Resolve<any> {
  constructor(private callerService: CallerService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    return this.callerService.getAllChats()
        .pipe(
          catchError((error) => {
            console.log('messages resolve err?', error);
            
            return EMPTY
          })
        )
    // return of(true);
  }
}
