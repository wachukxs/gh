import { Component, OnInit } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { LocationService } from '../services/location.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatChip, MatChipSelectionChange } from '@angular/material/chips';
import { CdkStepper } from '@angular/cdk/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HouseDetailDialogComponent } from '../house-detail-dialog/house-detail-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { ImageCarouselComponent } from '../image-carousel/image-carousel.component';

export interface Fact { // change to property
  text?: string;
  date?: string;
}

interface Place {
  value: string;
  viewValue: string;
}

interface PlacesGroup {
  // more relevant properties
  disabled?: boolean;
  distace: number;
  place: Place[];
}

interface HouseTypes {
  name: string;
  codeRef: string
}

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  animations: [
    trigger('likes', [
      transition('liked <=> unliked', [
        style({
          transform: `scale(1.5)`,
          opacity: 0
        }),
        animate('.2s 0s ease-out'),
      ])
    ]),
    trigger('iconChangeAnimation', [
      transition('* <=> *', [
        style({
          transform: `scale(1.5)`,
          opacity: 0
        }),
        animate('.2s 0s ease-out'),
      ])
    ]),
    trigger('testAni', [
      transition('favorite <=> bookmark', [
        style({
          transform: `scale(1.5)`,
          opacity: 0
        }),
        animate('.2s 0s ease-out'),
      ])
    ]),
  ]
})
export class FeedComponent implements OnInit {

  tiles: Tile[] = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];

  tilesTwo: Tile[] = [
    {text: 'Image', cols: 1, rows: 3, color: 'lightblue'},
    {text: 'Upper details', cols: 1, rows: 1, color: 'lightgreen'},
    {text: 'Upper details', cols: 1, rows: 1, color: 'lightgreen'},
    {text: 'Middle details', cols: 2, rows: 1, color: 'lightpink'},
    {text: 'Lower details', cols: 1, rows: 1, color: '#DDBDF1'},
    {text: 'Lower details', cols: 1, rows: 1, color: '#DDBDF1'},
  ];

  hidePlacesSelect: boolean = false;
  hideProximityPlacesSelect: boolean = false;

  location: any = undefined;

  budgetDisabled = false;
  houseTypeDisabled = false;
  proximityDisabled = false;

  places = new FormControl({value: '', disabled: this.proximityDisabled});
  placesList: string[] = [
    'Bodija', 'Aare', 'Lagos', 'Surelere', 'Iwo', 'Zamfara',
    'Osun', 'Ibafo', 'Mowe', 'Mile 12', 'Jos', 'Umuahia',
    'Kano', 'Kaduna', 'Port H.', 'Bende', 'Water G.', 'Ford'
  ];

  placesControl = new FormControl();
  placesGroup: PlacesGroup[] = [
    {
      distace: 355.34,
      place: [
        {value: 'bulbasaur-0', viewValue: 'Bulbasaur'},
        {value: 'oddish-1', viewValue: 'Oddish'},
        {value: 'bellsprout-2', viewValue: 'Bellsprout'}
      ]
    },
    {
      distace: 353.23,
      place: [
        {value: 'squirtle-3', viewValue: 'Squirtle'},
        {value: 'psyduck-4', viewValue: 'Psyduck'},
        {value: 'horsea-5', viewValue: 'Horsea'}
      ]
    },
    {
      distace: 523,
      disabled: true,
      place: [
        {value: 'charmander-6', viewValue: 'Charmander'},
        {value: 'vulpix-7', viewValue: 'Vulpix'},
        {value: 'flareon-8', viewValue: 'Flareon'}
      ]
    },
    {
      distace: 3,
      place: [
        {value: 'mew-9', viewValue: 'Mew'},
        {value: 'mewtwo-10', viewValue: 'Mewtwo'},
      ]
    }
  ];



  isPortraitHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
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
     * it's important that codeRef is same with filterForm.houseType...
     */

    availableHouseTypes: Array<HouseTypes> = [
      {name: '1 BHK',  codeRef: 'bhk1'},
      {name: '2 BHK',  codeRef: 'bhk2'},
      {name: '1 BK',  codeRef: 'bk1'},
      {name: '2B 1K',  codeRef: 'b2k1'},
      {name: '3B 1K',  codeRef: 'b3k1'},
      {name: '4B 1K',  codeRef: 'b4k1'}
    ];

  filterForm = new FormGroup({
    budget: new FormGroup({
      maxBudget: new FormControl(200000), // select highest value from db
      minBudget: new FormControl(50000), // select lowest value from db
      preferredMaxBudget: new FormControl(),
      preferredMinBudget: new FormControl(),
    }),
    houseType: new FormGroup({
      bhk1: new FormControl(),
      bhk2: new FormControl(),
      bk1: new FormControl(),
      b2k1: new FormControl(),
      b3k1: new FormControl(),
      b4k1: new FormControl(),
    }),
    proximity: new FormGroup({
      preferredDistance: new FormControl(),
      preferredPlaces: new FormControl(),
    }),
  });


  public slides = [
    { src: 'assets/images/r2.png' },
    { src: 'assets/images/k2.png' },
    { src: 'assets/images/yes.jpg' }
  ];

  likeState = false;
  bookmarkState = false;
  favouriteState = false;

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

  constructor(private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private clipboard: Clipboard,
              private snackBar: MatSnackBar,
              private locationService: LocationService) {
  }

  onSwipeRight(event: any): void {
  }

  onSwipeLeft(event: any): void {
  }

  ngOnInit() {

    /* this.breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
      console.log('brek pnt', result);
    }); */

    this.isPortraitHandset$.subscribe(value => console.log('is portrait handset', value));
    this.isTablet$.subscribe(value => console.log('is tablet', value));
  }

  bookmarkPost() {
    this.bookmarkState = !this.bookmarkState
  }

  favouritePost() {
    this.favouriteState = !this.favouriteState
  }

  /**
   * chipRef is the Angular object definition, while chip is from the UI
   */
  onChipClick(chipChangeEvent: MatChipSelectionChange, chip: any) {
    /**
     * if the filter is disabled, the chips shouldn't work.
     */
    if (!this.houseTypeDisabled) {
      this.filterForm.get(['houseType', chip.codeRef])?.setValue(chipChangeEvent.selected);
    }

  }

  budgetMaxSliderChange(newValue: number) {
    this.filterForm.get('budget.preferredMaxBudget')?.setValue(newValue);
  }

  budgetMinSliderChange(newValue: number) {
    this.filterForm.get('budget.preferredMinBudget')?.setValue(newValue);
  }

  proximitySliderChange(newValue: number) {
    // console.log('new slider value', newValue);
    this.filterForm.get('proximity.preferredDistance')?.setValue(newValue);
  }

  budgetDisableChange(evtObject: MatSlideToggleChange) {
    this.budgetDisabled = evtObject.checked; // we can do this different, but this is okay.
  }

  houseTypeDisableChange(evtObject: MatSlideToggleChange) {
    this.houseTypeDisabled = evtObject.checked;
  }

  proximityDisableChange(evtObject: MatSlideToggleChange) {
    this.proximityDisabled = evtObject.checked; // seems we don't need this anymore
    if (evtObject.checked) {
      this.places.disable()
    } else {
      this.places.enable()
    }

  }

  formatBudgetSliderLabel(value: number): string {
    if (value >= 1000) {
      return `${Math.round(value / 1000)}K`; // ₦
    }
    return value.toString();
  }

  formatProximitySliderLabel(value: number): string {
      return (value / 1000).toFixed(1);
  }

  /* getPosistion() {
    this.locationService.getPosition().then(pos => {
      console.log('posistion obj', pos);

      console.log(`Got Positon: lat ${pos.coords.longitude} lng ${pos.coords.latitude}`);

      // if we ever succesfully get a good posistion...
      // how do we check for a good position...
      // show the other places relative to user's proximity
      // and hide the other select input

      if (pos.coords.accuracy > 10) { // good position
        this.hidePlacesSelect = true;
        this.hideProximityPlacesSelect = false;
        // how about we just replace it (DOM Element) instead... ??
      } else {
        // request location again... or wait till there's good enough network after 2 tries
        // notify user if error persists and wait a bit before making another request or just wait for the user to repeat the action
        this.getPosistion();
      }
    }).catch(err => {
      console.log('An error occured', err);
    });
  } */

  /* watchPosistion() {
    const location = this.locationService.watchPosition().subscribe(pos => {
      console.log('Started watching position...');

      console.log(`Positon: lat ${pos.coords.longitude} lng ${pos.coords.latitude} at time ${pos.timestamp}`);
    }, err => {
      console.log(`An error occured`, err);
    }, () => {
      console.log('We\'re done');
    });

    // stop watching after 10 sec
    setTimeout(() => {
      location.unsubscribe();
    }, 10 * 1000);
  } */

  seeHouseDetails(): void {
    const dialogRef = this.dialog.open(HouseDetailDialogComponent, {
      width: '80%',
      data: {},
      maxWidth: '100%',
      maxHeight: '100%',
      ariaLabel: 'Details of the house you just clicked'
    });

    /* record that this house was seen, probably record how long it was seen. tell the agent who posted it? */
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
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

}


