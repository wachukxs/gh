import { BreakpointObserver } from '@angular/cdk/layout'
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Store } from '@ngrx/store'
import { throwError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { AppState } from '../ngrx-store/app.state'
import { URLPaths } from '../utils/constants.util'
import { BaseService } from './base.service'

@Injectable({
    providedIn: 'root',
})
export class CallerService extends BaseService {
    constructor(
        private http: HttpClient,
        snackBar: MatSnackBar,
        breakpointObserver: BreakpointObserver,
        store: Store<AppState>,
    ) {
        super(snackBar, breakpointObserver, store)
    }

    private JSONHttpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            timeout: `${3000}`, // doesn't seem to work
            // Authorization: 'my-auth-token',
        }),
        observe: 'response' as const,
        responseType: 'json' as const,
        withCredentials: true,
    }

    private TextHttpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/text',
            timeout: `${3000}`, // doesn't seem to work
            // Authorization: 'my-auth-token'
        }),
        observe: 'response' as const,
        responseType: 'text' as const,
        withCredentials: true,
    }

    private FormDataOptions = {
        headers: new HttpHeaders({
            // exclude content-type because we'd need to set boundary, and the browser might choose a different boundary, causing it to fail on the backend. Also, the browser sets it for us if we leave it.
            timeout: `${3000}`, // doesn't seem to work
            // Authorization: 'my-auth-token'
        }),
        observe: 'response' as const,
        responseType: 'text' as const,
        withCredentials: true,
    }

    // should this be commonly available ?
    private handleError(error: HttpErrorResponse) {
        console.error('got this error', error)
        // Report to sentry maybe?
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message)
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(error)

            console.error(
                `Backend returned code ${error.status}, ` +
                    `body was: ${error.error}`,
            )
        }
        // Return an observable with a user-facing error message.

        return throwError(error)
    }

    updateProfileBio(data: any) {
        console.log(
            'calling via',
            environment.baseurl + URLPaths.corpMemberProfileBioUpdate,
        )

        return this.http
            .post(
                environment.baseurl + URLPaths.corpMemberProfileBioUpdate,
                data,
                this.JSONHttpOptions,
            )
            .pipe(
                timeout(15000),
                // retry(3), // retry a failed request up to 3 times
                catchError(this.handleError), // then handle the error
            )
    }

    updateProfileOtherDetails(data: any) {
        console.log(
            'calling via',
            environment.baseurl + URLPaths.corpMemberProfileOtherDetailsUpdate,
        )

        return this.http
            .post(
                environment.baseurl +
                    URLPaths.corpMemberProfileOtherDetailsUpdate,
                data,
                this.JSONHttpOptions,
            )
            .pipe(
                timeout(15000),
                // retry(3), // retry a failed request up to 3 times
                catchError(this.handleError), // then handle the error
            )
    }

    updateProfilePpaDetails(data: any) {
        console.log(
            'calling via',
            environment.baseurl + URLPaths.corpMemberProfilePpaDetailsUpdate,
        )

        return this.http
            .post(
                environment.baseurl +
                    URLPaths.corpMemberProfilePpaDetailsUpdate,
                data,
                this.JSONHttpOptions,
            )
            .pipe(
                timeout(15000),
                // retry(3), // retry a failed request up to 3 times
                catchError(this.handleError), // then handle the error
            )
    }

    updateProfileServiceDetails(data: any) {
        console.log(
            'calling via',
            environment.baseurl +
                URLPaths.corpMemberProfileServiceDetailsUpdate,
        )

        return this.http
            .post(
                environment.baseurl +
                    URLPaths.corpMemberProfileServiceDetailsUpdate,
                data,
                this.JSONHttpOptions,
            )
            .pipe(
                timeout(15000),
                // retry(3), // retry a failed request up to 3 times
                catchError(this.handleError), // then handle the error
            )
    }

    joinWaitList(data: any) {
        console.log(
            'signing up via',
            environment.baseurl + URLPaths.joinWaitList,
        )

        return this.http
            .post(
                environment.baseurl + URLPaths.joinWaitList,
                data,
                this.JSONHttpOptions,
            )
            .pipe(
                timeout(15000),
                // retry(3), // retry a failed request up to 3 times
                catchError(this.handleError), // then handle the error
            )
    }

    createNewAccommodationPost(data: FormData) {
        return this.http.post(
            environment.baseurl + URLPaths.createNewAccommodationPost,
            data,
            this.FormDataOptions
        )
    }

    createNewSalePost(data: FormData) {
        return this.http.post(
            environment.baseurl + URLPaths.createNewSalePost,
            data,
            this.FormDataOptions
        )
    }

    signUp(data: any) {
        console.log(
            'sign up up via',
            environment.baseurl + URLPaths.corpMemberSignUp,
        )

        return this.http
            .post(
                environment.baseurl + URLPaths.corpMemberSignUp,
                data,
                this.JSONHttpOptions,
            )
            .pipe(
                timeout(15000),
                // retry(3), // retry a failed request up to 3 times
                catchError(this.handleError), // then handle the error
            )
    }

    corpMemberLogIn(data: any) {
        console.log(
            'log in via',
            environment.baseurl + URLPaths.corpMemberLogIn,
        )

        return this.http
            .post(
                environment.baseurl + URLPaths.corpMemberLogIn,
                data,
                this.JSONHttpOptions,
            )
            .pipe(
                timeout(15000),
                // retry(3), // retry a failed request up to 3 times
                catchError(this.handleError), // we'll handle from the calling component
            )
    }
}
