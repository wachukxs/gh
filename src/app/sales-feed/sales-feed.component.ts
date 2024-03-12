import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CallerService } from '../services/caller.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-sales-feed',
  templateUrl: './sales-feed.component.html',
  styleUrls: ['./sales-feed.component.css'],
  animations: [
    trigger('iconChangeAnimation', [
      transition('* <=> *', [
        style({
          transform: `scale(1.5)`,
          opacity: 0
        }),
        animate('.2s 0s ease-out'),
      ])
    ]),
  ]
})
export class SalesFeedComponent {

  placesList: string[] = Array.from('foobarecho')
  proximityDisabled = false;

  likeState = false;
  bookmarkState = false;
  favouriteState = false;

  budgetDisabled = false;

  constructor(public callerService: CallerService, private dialog: MatDialog,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,) {

}

  places = new FormControl({value: '', disabled: !this.proximityDisabled});
  /**
   * TODO: match these correctly, like in feed component
   */
  filterForm = new FormGroup({
    budget: new FormGroup({
      maxBudget: new FormControl(200000), // select highest value from db
      minBudget: new FormControl(50000), // select lowest value from db
      preferredMaxBudget: new FormControl(),
      preferredMinBudget: new FormControl(),
    }),
    proximity: new FormGroup({
      preferredDistance: new FormControl(),
      preferredPlaces: new FormControl(),
    }),
  });

  hidePlacesSelect: boolean = false; // why do we need this?

  /**
   * copied from https://github.com/angular/components/issues/15578#issuecomment-475792789
   */
  protected get toggleLikeState(): '_border' | '' {
    return this.likeState ? '_border' : '';
  }

  protected get toggleBookmarkIcon(): 'bookmark_border' | 'bookmark' {
    return this.bookmarkState ? 'bookmark_border' : 'bookmark';
  }

  protected get toggleFavouriteIcon(): 'favorite_border' | 'favorite' {
    return this.favouriteState ? 'favorite_border' : 'favorite';
  }

  seeSaleDetails() {
    this.callerService.showNotification('Will show more details')
  }

  formatProximitySliderLabel(value: number): string {
      return (value / 1000).toFixed(1);
  }

  proximitySliderChange(newValue: number) {
    // console.log('new slider value', newValue);
    this.filterForm.get('proximity.preferredDistance')?.setValue(newValue);
  }

  resetFilters() {
    // testing
  }

  formatBudgetSliderLabel(value: number): string {
    if (value >= 1000) {
      return `${Math.round(value / 1000)}K`; // ₦
    }
    return value.toString();
  }


  proximityDisableChange(evtObject: MatSlideToggleChange) {
    this.proximityDisabled = evtObject.checked; // seems we don't need this anymore
    if (evtObject.checked) {
      this.places.disable()
    } else {
      this.places.enable()
    }

  }

  budgetMinSliderChange(newValue: number) {
    this.filterForm.get('budget.preferredMinBudget')?.setValue(newValue);
  }

  budgetMaxSliderChange(newValue: number) {
    this.filterForm.get('budget.preferredMaxBudget')?.setValue(newValue);
  }

  budgetDisableChange(evtObject: MatSlideToggleChange) {
    this.budgetDisabled = evtObject.checked; // we can do this different, but this is okay.
  }

  copyAgentPhoneNumber(): void {
    const copy = this.clipboard.copy('080 564 23456');
    if (copy) {
      this.snackBar.open('Copied phone number.', 'Good', {
        duration: 2000,
      });
    } else {
      this.snackBar.open('Copying failed. Try again?', 'Close', {
        duration: 2000,
      });
    }
  }

    bookmarkSalePost() {
      this.bookmarkState = !this.bookmarkState
    }

    favouriteSalePost() {
      this.favouriteState = !this.favouriteState
    }
}
