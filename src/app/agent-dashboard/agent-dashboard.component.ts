import { Component, OnInit, isDevMode } from '@angular/core'
import { map } from 'rxjs/operators'
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { ExitConfirmationDialogComponent } from '../dialogs/exit-confirmation-dialog/exit-confirmation-dialog.component'
import { MatDialog } from '@angular/material/dialog'
import { CanExit } from '../services/authentication.service'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
    selector: 'app-agent-dashboard',
    templateUrl: './agent-dashboard.component.html',
    styleUrls: ['./agent-dashboard.component.css'],
})
export class AgentDashboardComponent implements OnInit, CanExit {
    /** Based on the screen size, switch from standard to one column per row */
    cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(({ matches }) => {
            console.log("what's matches:", matches)

            if (matches) {
                return [
                    { title: 'Card 1', cols: 1, rows: 1 },
                    { title: 'Card 2', cols: 1, rows: 1 },
                    { title: 'Card 3', cols: 1, rows: 1 },
                    { title: 'Card 4', cols: 1, rows: 1 },
                ]
            }

            return [
                { title: 'Card 1', cols: 2, rows: 1 },
                { title: 'Card 2', cols: 1, rows: 1 },
                { title: 'Card 3', cols: 1, rows: 2 },
                { title: 'Card 4', cols: 1, rows: 1 },
            ]
        }),
    )

    you: any

    dev = isDevMode()

    theAgent: any = {}

    houses: Array<any> = [] // get data type of houses
    houseTypes: Array<string> = [
        'Duplex',
        'Bongalow',
        'Flat',
        'Skyscrapper',
        'Dungeon',
        'Castle',
    ]

    constructor(
        private snackBar: MatSnackBar,
        private httpClient: HttpClient,
        private breakpointObserver: BreakpointObserver,
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
    ) {
        // This key needs to be replaced, but this whole component isn't used.
        const agnt = localStorage.getItem('online-corper')
        if (agnt) {
            this.theAgent = agnt // TODO: we aren't using agent.
        }
    }

    propertyForm = new FormGroup(
        {
            by: new FormControl(), // JSON.parse(this.theAgent).resource_uri
            bedrooms: new FormControl(''),
            kitchen: new FormControl(''),
            toilet: new FormControl(''),
            bathrooms: new FormControl(''),
            // graphics: new FormControl('', [Validators.required]),
            house_type: new FormControl('', [Validators.required]),
            price: new FormControl('', [Validators.required]),
            street: new FormControl(''),
            city_or_town: new FormControl(''),
            state: new FormControl(''),
            number: new FormControl(''),
        },
        [Validators.required],
    )

    houseFormData = new FormData()

    step = 0

    loadingHouseDataTries = 0

    folders: any[] = [
        {
            name: 'Photos',
            updated: new Date('1/1/16'),
        },
        {
            name: 'Recipes',
            updated: new Date('1/17/16'),
        },
        {
            name: 'Work',
            updated: new Date('1/28/16'),
        },
    ]
    notes: any[] = [
        {
            name: 'Vacation Itinerary',
            updated: new Date('2/20/16'),
        },
        {
            name: 'Kitchen Remodel',
            updated: new Date('1/18/16'),
        },
    ]

    setStep(index: number) {
        this.step = index
    }

    nextStep() {
        this.step++
    }

    prevStep() {
        this.step--
    }

    ngOnInit() {
        this.you = JSON.parse(this.theAgent)
        // this.propertyForm.controls.by.patchValue

        this.loadHousesData()
    }

    loadHousesData() {}

    aHouseImages(): void {}

    deleteHouseImage(): void {}

    houseMedia(event: any, houseID: number): void {
        console.log('house media', event.target.files)
    }

    updateHouseInfo(): void {}

    postHouse() {
        console.log('posting', this.propertyForm.value)

        // convert formControl to formData
        /* Object.entries(this.propertyForm.value).forEach((value: [string, string | Blob], index, arr) => {
      this.houseFormData.append(value[0], value[1]);
    }); */
    }

    canDeactivate(): Promise<any> | boolean {
        if (this.houseFormData.has('images')) {
            // means there's a picture to post/update
            return new Promise((resolve, reject) => {
                const confirm = this.dialog.open(
                    ExitConfirmationDialogComponent,
                    {
                        data: {
                            message: 'unsaved changes',
                            username: 'u-name',
                        },
                    },
                )
                confirm.afterClosed().subscribe(
                    (res) => {
                        if (res === 'wait') {
                            resolve(false)
                        } else {
                            resolve(true)
                        }
                    },
                    (err) => {
                        // might never get here, to err
                        console.log(`exit confirmation Dialog error: ${err}`)
                        resolve(false)
                    },
                )
            })
        } else {
            return true
        }
    }
}
