import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { URLPaths } from '../utils/constants.util';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CallerService extends BaseService {

  constructor(private http: HttpClient, snackBar: MatSnackBar, breakpointObserver: BreakpointObserver) {
    super(snackBar, breakpointObserver)
  }

  private JSONHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'timeout': `${3000}`, // doesn't seem to work
      // Authorization: 'my-auth-token'
    }),
    observe: 'response' as const,
    responseType: 'json' as const,
  };

  private TextHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/text',
      timeout: `${3000}`, // doesn't seem to work
      // Authorization: 'my-auth-token'
    }),
    observe: 'response' as const,
    responseType: 'text' as const,
  };

  // should this be commonly available ?
  private handleError(error: HttpErrorResponse) {
    console.error('got this error', error);
    
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(error);
      
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.

    return throwError(error);
  }

  joinWaitList(data: any) {
    console.log('signing up via', environment.baseurl + URLPaths.joinWaitList);
    
    return this.http.post(environment.baseurl + URLPaths.joinWaitList, data, this.JSONHttpOptions)
    .pipe(
      timeout(15000),
      // retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  createNewPost(data: any) {
    return this.http.post(environment.baseurl + URLPaths.createNewPost, data)
  }

  signUp(data: any) {
    console.log('sign up up via', environment.baseurl + URLPaths.corpMemberSignUp);
    
    return this.http.post(environment.baseurl + URLPaths.corpMemberSignUp, data, this.JSONHttpOptions)
    .pipe(
      timeout(15000),
      // retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }
}
