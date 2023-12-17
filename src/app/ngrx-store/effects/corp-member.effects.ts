import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { CallerService } from 'src/app/services/caller.service';
import { profileUpdateError, profileUpdateSuccess, updateCorpMemberProfile } from '../actions/corp-member.actions';



@Injectable()
export class CorpMemberEffects {
  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCorpMemberProfile),
      debounceTime(500),
      switchMap((data) => this.callerService.updateProfile(data).pipe(
        map(res => profileUpdateSuccess({data: res.body})),
        catchError(() => of(profileUpdateError()))
      ))
    )
  );

  constructor(private actions$: Actions, private callerService: CallerService) {}
}
