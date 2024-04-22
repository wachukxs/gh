import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { CreateNewAccommodationComponent } from '../dialogs/create-new-accommodation/create-new-accommodation.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewSaleComponent } from '../dialogs/create-new-sale/create-new-sale.component';
import { AddNewPlaceDialogComponent } from '../dialogs/add-new-place-dialog/add-new-place-dialog.component';

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

  openAddNewPPADialog() {
    try {
      const dialogRef = this.dialog.open(AddNewPlaceDialogComponent, {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data: {},
        ariaLabel: 'Dialog to list a ppa',
        role: 'dialog',
      });
  
      /* record that this house was seen, probably record how long it was seen. tell the agent who posted it? */
      dialogRef.afterClosed().subscribe((result) => {
        console.log('The accommodation dialog was closed', result);
      });
    } catch (error) {
      console.log('err opening dialog to add new ppa', error);
      
    }
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
    sessionStorage.removeItem('_online')
    console.log('laugh', this.router.url)
    /**
     * should refresh the page if you're in the home page (/).
     * Using this.router.navigate(['']) or '/', if you're in the / home page, won't navigate since the url doesn't change.
     */
    if (this.router.url === '/') {
      window.location.reload()
    } else {
      this.router.navigate(['/']);
    }
  }

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private dialog: MatDialog,) {}

}
