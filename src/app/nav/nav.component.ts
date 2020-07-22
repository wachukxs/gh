import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  rightMeunState = false;

  /**
   * copied from https://github.com/angular/components/issues/15578#issuecomment-475792789
   */
  protected get toggleRightMeunState(): '_open' | '' {
    return this.rightMeunState ? '_open' : '' ;
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  logout(): void {
    sessionStorage.removeItem('green-homes-agent');
    this.router.navigate(['/']);
  }

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {}

}
