import { HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
    Router,
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
} from '@angular/router'
import { EMPTY, Observable, of } from 'rxjs'
import { CallerService } from '../services/caller.service'
import { catchError } from 'rxjs/operators'

@Injectable({
    providedIn: 'root',
})
export class ProfilePageResolver implements Resolve<any> {
    constructor(private callerService: CallerService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<any> {
        return this.callerService.fetchAllNigeriaStatesAndLGAs()
        .pipe(
          catchError((error) => {
            return EMPTY
          })
        )

        // return of(true);
    }
}
