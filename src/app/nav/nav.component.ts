import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | undefined;

  menuState = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  /**
   * copied from https://github.com/angular/components/issues/15578#issuecomment-475792789
   */
  menuOpen(): void {
    this.menuState = '_open';
  }

  menuClose(): void {
    this.menuState = '';
  }

  logout(): void {
    sessionStorage.removeItem('green-homes-agent');
    this.router.navigate(['/']);
  }

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {}

}
