import { Component, OnInit } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { FactService } from '../fact.service';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { LocationService } from '../location.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatChip } from '@angular/material/chips';

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

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  hidePlacesSelect: boolean;
  hideProximityPlacesSelect: boolean;

  location: any = undefined;

  places = new FormControl();
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

  dataSource: FactsDataSource | object;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    /**
     * it's important that codeRef is same with filterForm.houseType...
     */

    availableHouseTypes = [
      {name: '1 BHK', selected: false, codeRef: 'bhk1'},
      {name: '2 BHK', selected: false, codeRef: 'bhk2'},
      {name: '1 BK', selected: false, codeRef: 'bk1'},
      {name: '2B 1K', selected: false, codeRef: 'b2k1'},
      {name: '3B 1K', selected: false, codeRef: 'b3k1'},
      {name: '4B 1K', selected: false, codeRef: 'b4k1'}
    ];

  filterForm = new FormGroup({
    budget: new FormGroup({
      maxBudget: new FormControl(),
      minBudget: new FormControl(),
      preferredBudget: new FormControl(),
      disableBudget: new FormControl()
    }),
    houseType: new FormGroup({
      bhk1: new FormControl(),
      bhk2: new FormControl(),
      bk1: new FormControl(),
      b2k1: new FormControl(),
      b3k1: new FormControl(),
      b4k1: new FormControl(),
      disableHouseType: new FormControl()
    }),
    proximity: new FormGroup({
      distance: new FormControl(),
      preferredPlaces: new FormControl(),
      disableProximity: new FormControl()
    }),
  });

  constructor(public factService: FactService,
              private breakpointObserver: BreakpointObserver,
              private locationService: LocationService) {
    this.dataSource = new FactsDataSource(factService);
  }

  ngOnInit() {
    console.log('data source:', this.dataSource);
    console.log('filter form:', this.filterForm.value);
    this.filterForm.valueChanges.subscribe(change => {
      console.log('new filter form change:', change);
    });

  }

  /**
   * chipRef is the Angular object definition, while chip is from the UI
   */

  onChipClick(chipRef: MatChip, chip) {
    chipRef.toggleSelected();
    // chipRef.select();
    // chipRef.selected = !chipRef.selected;
    // chip.selected = !chip.selected;

    console.log('chipRef', chipRef.selected);
    this.filterForm.get(['houseType', chip.codeRef]).setValue(chipRef.selected);
  }

  budgetSliderChange(newValue: number) {
    // console.log('new slider value', newValue);
    this.filterForm.get('budget.preferredBudget').setValue(newValue);
  }

  budgetDisableChange(evtObject: MatSlideToggleChange) {
    console.log('new disable value', typeof evtObject);
    this.filterForm.get(['budget', 'disableBudget']).setValue(evtObject.checked);
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return `${Math.round(value / 1000)}K`; // ₦
    }

    return value;
  }

  getPosistion() {
    this.locationService.getPosition().then(pos => {
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
  }

  watchPosistion() {
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
  }

}


export class FactsDataSource extends DataSource<object | Fact | undefined> {
  private cachedFacts = Array.from<object | Fact>({ length: 0 });
  private dataStream = new BehaviorSubject<(object | Fact | undefined)[]>(this.cachedFacts);
  private subscription = new Subscription();

  private pageSize = 10;
  private lastPage = 0;

  constructor(private factService: FactService) {
    super();

    // Start with some data.
    this._fetchFactPage();
  }

  private _fetchFactPage(): void {
    for (let i = 0; i < this.pageSize; ++i) {
      this.factService.getRandomFact().subscribe(res => {
        this.cachedFacts = this.cachedFacts.concat(res);
        this.dataStream.next(this.cachedFacts);
      });
    }
  }

  private _getPageForIndex(i: number): number {
    return Math.floor(i / this.pageSize);
  }

  // from DataSource interface
  connect(collectionViewer: CollectionViewer): Observable<(object | Fact | undefined)[] | ReadonlyArray<object | Fact | undefined>> {
    this.subscription.add(collectionViewer.viewChange.subscribe(range => {
      // Update the data
      const currentPage = this._getPageForIndex(range.end);

      // console.log('what\'s range.end:', range.end, 'what\'s range:', range);

      /* if (currentPage && range) {
        console.log('current page:', currentPage, 'last page:', this.lastPage);
      } */

      if (currentPage > this.lastPage) {
        this.lastPage = currentPage;
        this._fetchFactPage();
      }
    }));
    return this.dataStream;
  }
  /**
   *
   * @param collectionViewer
   * The data source is subscribed
   * to any changes in the collection viewer
   * (e.g. the user scrolls), and will then perform an action
   * and return the data stream. We are going to tell the
   * data source to get more data when we have reached the end of the list.
   */

  // from DataSource interface
  disconnect(collectionViewer: CollectionViewer): void {
    this.subscription.unsubscribe();
  }
}
