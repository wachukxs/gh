import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { CreateNewAccommodationComponent } from '../create-new-accommodation/create-new-accommodation.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewSaleComponent } from '../create-new-sale/create-new-sale.component';

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

  openCreateAccommodationPostDialog() {
    const dialogRef = this.dialog.open(CreateNewAccommodationComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: {},
      ariaLabel: 'Dialog to create a new accommodation post',
      role: 'dialog',
    });

    /* record that this house was seen, probably record how long it was seen. tell the agent who posted it? */
    dialogRef.afterClosed().subscribe(result => {
      console.log('The accommodation dialog was closed');
    });
  }

  openCreateSalePostDialog() {
    const dialogRef = this.dialog.open(CreateNewSaleComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: {},
      ariaLabel: 'Dialog to create a new sale post',
      role: 'dialog',
    });

    /* record that this house was seen, probably record how long it was seen. tell the agent who posted it? */
    dialogRef.afterClosed().subscribe(result => {
      console.log('The sale dialog was closed');
    });
  }

  logout(): void {
    localStorage.removeItem('online-corper');
    this.router.navigate(['/']);
  }

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private dialog: MatDialog,) {}

}
