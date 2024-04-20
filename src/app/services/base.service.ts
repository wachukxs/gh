import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { AppState, CorpMemberState } from '../ngrx-store/app.state';
import { selectFeatureCorpMember, selectStateCorpMember } from '../ngrx-store/selectors/corp.selectors';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  public LOCAL_STORAGE_DATA_KEY: string = 'online-corper'
  public SESSION_STORAGE_DATA_KEY: string = '_online'

  _store: Store<AppState> = this.store // TODO: can't we do this better?

  corpMember$!: Observable<CorpMemberState>
  corpMember!: CorpMemberState

  constructor(private snackBar: MatSnackBar, private breakpointObserver: BreakpointObserver, private store: Store<AppState>) {
    this.corpMember$ = this.store.select(selectFeatureCorpMember)
    this.store
    // .pipe(select(state => state.corper))
    // .select('corper')
    .select(selectFeatureCorpMember)
    // .select(selectStateCorpMember)
    // .select(state => state.corper)
    // .pipe(tap((data) => console.log('??', data)))
    .subscribe({
      next: (value) => {
        // console.log('selectFeatureCorpMember', value);
        // console.log('trying', value);

        this.corpMember = value
      }
    });
    
  }

  showNotification(message: string, duration = 5000, action: string = 'OK', verticalPosition: MatSnackBarVerticalPosition = 'bottom') {
    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: verticalPosition
    })
  }

  isHandset$(): Observable<boolean> {
    return this.breakpointObserver
    .observe([Breakpoints.Handset]) // needs work??
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  }

  isSmallScreen(): boolean {
    return this.breakpointObserver
    .isMatched('(max-width: 600px)') // eventually use this, and depreciate isHandset$
  }

  isSmallScreen$(): Observable<boolean> {
    return this.breakpointObserver
    .observe('(max-width: 600px)') // needs work??
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  }

  isPortraitHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  isTablet$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Tablet)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  isPortraitTablet$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.TabletPortrait)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  isLandscapeTabletWeb$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Web, Breakpoints.TabletLandscape])
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  /**
   * an array of the NYSC abbreviation standard of all the states in nigeria
   */
  states_short:Array<string> = ['AB', 'AD', 'AK', 'AN', 'BA', 'BY', 'BN', 'BO', 'CR', 'DT', 'EB', 'ED', 'EK', 'EN', 'FC', 'GM', 'IM', 'JG', 'KD', 'KN', 'KT', 'KB', 'KG', 'KW', 'LA', 'NS', 'NG', 'OG', 'OD', 'OS', 'OY', 'PL', 'RV', 'SO', 'TR', 'YB', 'ZM'];

  /**
   * an array of all the states in nigeria
   */
  states_long:Array<string> = ['ABIA', 'ADAMAWA', 'AKWA IBOM', 'ANAMBRA', 'BAUCHI', 'BAYELSA', 'BENUE', 'BORNO', 'CROSS RIVER', 'DELTA', 'EBONYI', 'EDO', 'EKITI', 'ENUGU', 'FCT - ABUJA', 'GOMBE', 'IMO', 'JIGAWA', 'KADUNA', 'KANO', 'KASTINA', 'KEBBI', 'KOGI', 'KWARA', 'LAGOS', 'NASSARAWA', 'NIGER', 'OGUN', 'ONDO', 'OSUN', 'OYO', 'PLATEAU', 'RIVERS', 'SOKOTO', 'TARABA', 'YOBE', 'ZAMFARA'];

  years = parseInt( new Date( Date.now() ).getFullYear().toFixed().slice( 2, 4 ) );
  yearRange = '(' + ( this.years - 1 ).toString() + '|' + this.years.toString() + ')';
  servingCorpMemberStateCodeRegex = new RegExp(`(ab|ad|ak|an|ba|by|bn|bo|cr|dt|eb|ed|ek|en|fc|gm|im|jg|kd|kn|kt|kb|kg|kw|la|ns|ng|og|od|os|oy|pl|rv|so|tr|yb|zm)\\/${ this.yearRange }[abc]\\/[0-9]{4,5}`, 'i')

  corpMemberStateCodeRegex = /(ab|ad|ak|an|ba|by|bn|bo|cr|dt|eb|ed|ek|en|fc|gm|im|jg|kd|kn|kt|kb|kg|kw|la|ns|ng|og|od|os|oy|pl|rv|so|tr|yb|zm)\/\d\d[abc]\/[0-9]{4,5}/i
}
