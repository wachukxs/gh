import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { CallerService } from '../services/caller.service'
import { MatDialog } from '@angular/material/dialog'
import { HttpResponse, HttpStatusCode } from '@angular/common/http'
import { debounceTime, distinctUntilChanged, filter, map, startWith, switchMap } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { LeaveReviewComponent } from '../dialogs/leave-review/leave-review.component'
import { PpaModel } from '../ngrx-store/app.state'

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.css'],
})
export class SearchPageComponent implements OnInit {
    initialResults = {
        sales: [],
        corp_members: [],
        ppas: [],
        accommodations: []
    }
    results: {
        sales: Array<any>,
        corp_members: Array<any>,
        accommodations: Array<any>
        ppas: Array<any>
    } = this.initialResults

    /* The currently selected tab index of search results */
    selectedTabIndex = 0

    isFetchingResults: boolean = false
    constructor(
        public callerService: CallerService,
        public dialog: MatDialog,
    ) {}

    filteredOptions: Observable<string[]> | undefined;

    ngOnInit() {
        // todo, don't call all items, maybe just the most searched ones (first 20).
        this.isFetchingResults = true
        this.callerService.getAllItems().subscribe({
            next: (res: HttpResponse<any>) => {
                console.log('items data', res)
                if (res.status === HttpStatusCode.Ok) {
                    this.results = res.body
                } // TODO: need else block?
                this.isFetchingResults = false
            },
            error: (err) => {
                this.callerService.showNotification('Failed to retrieve data')
                this.isFetchingResults = false
            },
        })

        this.searchForm?.valueChanges
        .pipe(
            debounceTime(500), // Wait 300ms after the user stops typing
            // filter((value) => value?.searchText || value?.state),
            distinctUntilChanged(), // Only emit if the current value is different than the last
            switchMap((value) => { // Cancels the previous API call if a new value is emitted.
                console.log('searching...', value)
                
                // TODO: if there's no searchText, return 20 most recent/most searched items?
                return this.callerService.search(value)
                
            })
        )
        .subscribe({
            next: (res: HttpResponse<any>) => {
                console.log('done searching', res)
                if (res.status === HttpStatusCode.Ok) {
                    this.results = res.body
                }
            },
            error: (err) => {
                /**
                 * BUG: after a server error, subsequent searches don't work
                 */
                console.log('ERR searching', err)
            },
        })

        this.filteredOptions = this.searchForm?.get('state')?.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    searchForm: FormGroup = new FormGroup({
        searchText: new FormControl('', []),
        state: new FormControl('', []),
    });

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
    
        return this.callerService.states_long.filter(option => option.toLowerCase().includes(filterValue));
    }

    clearSearchInput() {
        this.searchForm?.get('searchText')?.setValue('')
    }

    menuState = ''

    toggleMenuState(): void {
        this.menuState = this.menuState == '' ? '_open' : ''
    }

    // why?
    logSearchInput(): void {}


    leaveReview(ppa: PpaModel | any) {
        const confirm = this.dialog.open(LeaveReviewComponent, {
            maxWidth: '360px',
            data: {
                ppa,
            },
        })

        confirm.afterClosed().subscribe(
            (res: any) => {
                console.log('closed review modal', res)

                // If nothing was done, don't bother.
                if (!res?.comment && !res?.star_rating) {
                    return
                }
                this.callerService.addNewPpaReview(res).subscribe({
                    next: (res) => {
                        console.log('res', res)
                        if (res.status === 200) {
                            this.callerService.showNotification(
                                'PPA Review added!',
                            ) // show link to the PPA? For them to also share in groups, PPA should have directions on how to find it??
                            // TODO: reset form, show notification
                            // TODO: should we reload the whole PPA list??? or fetch the new info?? OR return just the PPA that was reviewed?
                        } else {
                            // else show error message?
                            this.callerService.showNotification(
                                'Failed to add PPA Review',
                            )
                        }
                    },
                    error: (err) => {
                        console.log('err', err)
                        this.callerService.showNotification(
                            'Failed to add PPA Review',
                        )
                    },
                })
            },
            (err: any) => {
                // might never get here, to err
                console.log(`exit confirmation Dialog error:`, err)
            },
        )
    }
}
