import { Component, OnInit } from '@angular/core'
import { CollectionViewer, DataSource } from '@angular/cdk/collections'
import { BehaviorSubject, Subscription, Observable } from 'rxjs'
import { Clipboard } from '@angular/cdk/clipboard'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { map, shareReplay } from 'rxjs/operators'
import { LocationService } from '../services/location.service'
import { FormControl, FormGroup } from '@angular/forms'
import { MatSlideToggleChange } from '@angular/material/slide-toggle'
import { MatChip, MatChipSelectionChange } from '@angular/material/chips'
import { CdkStepper } from '@angular/cdk/stepper'
import { MatSnackBar } from '@angular/material/snack-bar'
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog'
import { trigger, state, style, animate, transition } from '@angular/animations'
import { ImageCarouselComponent } from '../image-carousel/image-carousel.component'
import { IOEventName, SocketIoService } from '../services/socket-io.service'
import { CallerService } from '../services/caller.service'

// https://stackoverflow.com/questions/52566563/how-to-use-socket-io-in-angular-with-node-js

export interface Fact {
    // change to property
    text?: string
    date?: string
}

interface Place {
    value: string
    viewValue: string
}

interface PlacesGroup {
    // more relevant properties
    disabled?: boolean
    distance: number
    place: Place[]
}

interface HouseTypes {
    name: string
    codeRef: string
}

export interface Tile {
    color: string
    cols: number
    rows: number
    text: string
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
                    opacity: 0,
                }),
                animate('.2s 0s ease-out'),
            ]),
        ]),
        trigger('iconChangeAnimation', [
            transition('* <=> *', [
                style({
                    transform: `scale(1.5)`,
                    opacity: 0,
                }),
                animate('.2s 0s ease-out'),
            ]),
        ]),
        trigger('testAni', [
            transition('favorite <=> bookmark', [
                style({
                    transform: `scale(1.5)`,
                    opacity: 0,
                }),
                animate('.2s 0s ease-out'),
            ]),
        ]),
    ],
})
export class FeedComponent implements OnInit {
    tiles: Tile[] = [
        { text: 'One', cols: 3, rows: 1, color: 'lightblue' },
        { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
        { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
        { text: 'Four', cols: 2, rows: 1, color: '#DDBDF1' },
    ]

    tilesTwo: Tile[] = [
        { text: 'Image', cols: 1, rows: 3, color: 'lightblue' },
        { text: 'Upper details', cols: 1, rows: 1, color: 'lightgreen' },
        { text: 'Upper details', cols: 1, rows: 1, color: 'lightgreen' },
        { text: 'Middle details', cols: 2, rows: 1, color: 'lightpink' },
        { text: 'Lower details', cols: 1, rows: 1, color: '#DDBDF1' },
        { text: 'Lower details', cols: 1, rows: 1, color: '#DDBDF1' },
    ]

    hidePlacesSelect: boolean = false // why do we need this?
    hideProximityPlacesSelect: boolean = false

    location: any = undefined

    budgetDisabled = false
    houseTypeDisabled = false
    proximityDisabled = false

    places = new FormControl({ value: '', disabled: !this.proximityDisabled })
    placesList: string[] = [
        'Bodija',
        'Aare',
        'Lagos',
        'Surelere',
        'Iwo',
        'Zamfara',
        'Osun',
        'Ibafo',
        'Mowe',
        'Mile 12',
        'Jos',
        'Umuahia',
        'Kano',
        'Kaduna',
        'Port H.',
        'Bende',
        'Water G.',
        'Ford',
    ]

    placesControl = new FormControl()
    placesGroup: PlacesGroup[] = [
        {
            distance: 355.34,
            place: [
                { value: 'bulbasaur-0', viewValue: 'Bulbasaur' },
                { value: 'oddish-1', viewValue: 'Oddish' },
                { value: 'bellsprout-2', viewValue: 'Bellsprout' },
            ],
        },
        {
            distance: 353.23,
            place: [
                { value: 'squirtle-3', viewValue: 'Squirtle' },
                { value: 'psyduck-4', viewValue: 'Psyduck' },
                { value: 'horsea-5', viewValue: 'Horsea' },
            ],
        },
        {
            distance: 523,
            disabled: true,
            place: [
                { value: 'charmander-6', viewValue: 'Charmander' },
                { value: 'vulpix-7', viewValue: 'Vulpix' },
                { value: 'flareon-8', viewValue: 'Flareon' },
            ],
        },
        {
            distance: 3,
            place: [
                { value: 'mew-9', viewValue: 'Mew' },
                { value: 'mewtwo-10', viewValue: 'Mewtwo' },
            ],
        },
    ]

    /**
     * it's important that codeRef is same with filterForm.houseType...
     */

    availableHouseTypes: Array<HouseTypes> = [
        { name: '1 BHK', codeRef: 'bhk1' },
        { name: '2 BHK', codeRef: 'bhk2' },
        { name: '1 BK', codeRef: 'bk1' },
        { name: '2B 1K', codeRef: 'b2k1' },
        { name: '3B 1K', codeRef: 'b3k1' },
        { name: '4B 1K', codeRef: 'b4k1' },
    ]

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
    })

    public slides = [
        { src: 'assets/images/r2.png' },
        { src: 'assets/images/k2.png' },
        { src: 'assets/images/yes.jpg' },
    ]

    feedData = [{}, {}, {}, {}].fill(
        {
            _price: '423,244',
            _age: 'a few seconds ago',
            last_updated_age: 'a few seconds ago',
            _type: 'sale',
            id: 5,
            corp_member_id: 2,
            text: 'Blueyuyy',
            item_name: 'Hello',
            price: 423244,
            Media: [
                {
                    id: 4,
                    url: 'https://chuks.name.ng/chuks.name.ng/corpers_ng_data/f5287e2ed12d19cb25deeadc9b014e9abe74c987.png',
                    sale_id: 5,
                    updated_at: '2024-05-03T07:14:32.103Z',
                    created_at: '2024-05-03T07:14:32.103Z',
                },
                {
                    id: 5,
                    url: 'https://chuks.name.ng/chuks.name.ng/corpers_ng_data/89e1e5d3ae0fe38a08e1203d306652a479131730.png',
                    sale_id: 5,
                    updated_at: '2024-05-03T07:14:32.104Z',
                    created_at: '2024-05-03T07:14:32.104Z',
                },
            ],
            updated_at: '2024-05-03T07:14:31.978Z',
            created_at: '2024-05-03T07:14:31.978Z',
        },
        0,
        4,
    )

    constructor(
        private breakpointObserver: BreakpointObserver,
        private dialog: MatDialog,
        private clipboard: Clipboard,
        private snackBar: MatSnackBar,
        public callerService: CallerService,
        private socketIoService: SocketIoService,
        private locationService: LocationService,
    ) {}

    onSwipeRight(event: any): void {}

    onSwipeLeft(event: any): void {}

    ngOnInit() {
        /* this.breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
      console.log('brek pnt', result);
    }); */

        // this.isPortraitHandset$.subscribe(value => console.log('is portrait handset', value));

        // this.isTablet$.subscribe(value => console.log('is tablet', value));

        this.socketIoService.onEvent(IOEventName.HI).subscribe((data) => {
            console.log('new hi data:', data)
        })

        this.socketIoService
            .onEvent(IOEventName.BROADCAST_MESSAGE)
            .subscribe((data: any) => {
                console.log('new bc data:', data)

                // TODO: only handling sale for now. (remove later)
                if (data?.post?.[0]?._type === 'sale') {
                    this.feedData = [...data?.post, ...this.feedData]
                }
            })
    }

    resetFilters() {
        // testing

        this.socketIoService.sendEvent(IOEventName.HI, 'sth')
    }

    /**
     * chipRef is the Angular object definition, while chip is from the UI
     */
    onChipClick(chipChangeEvent: MatChipSelectionChange, chip: any) {
        /**
         * if the filter is disabled, the chips shouldn't work.
         */
        if (!this.houseTypeDisabled) {
            this.filterForm
                .get(['houseType', chip.codeRef])
                ?.setValue(chipChangeEvent.selected)
        }
    }

    budgetMaxSliderChange(newValue: number) {
        this.filterForm.get('budget.preferredMaxBudget')?.setValue(newValue)
    }

    budgetMinSliderChange(newValue: number) {
        this.filterForm.get('budget.preferredMinBudget')?.setValue(newValue)
    }

    proximitySliderChange(newValue: number) {
        // console.log('new slider value', newValue);
        this.filterForm.get('proximity.preferredDistance')?.setValue(newValue)
    }

    budgetDisableChange(evtObject: MatSlideToggleChange) {
        this.budgetDisabled = evtObject.checked // we can do this different, but this is okay.
    }

    houseTypeDisableChange(evtObject: MatSlideToggleChange) {
        this.houseTypeDisabled = evtObject.checked
    }

    proximityDisableChange(evtObject: MatSlideToggleChange) {
        this.proximityDisabled = evtObject.checked // seems we don't need this anymore
        if (evtObject.checked) {
            this.places.disable()
        } else {
            this.places.enable()
        }
    }

    formatBudgetSliderLabel(value: number): string {
        if (value >= 1000) {
            return `${Math.round(value / 1000)}K` // ₦
        }
        return value.toString()
    }

    formatProximitySliderLabel(value: number): string {
        return (value / 1000).toFixed(1)
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

    ngOnDestroy() {
        this.socketIoService.destroy()
    }
}
