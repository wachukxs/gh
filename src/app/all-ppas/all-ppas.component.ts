import { Component, OnInit } from '@angular/core'
import { CallerService } from '../services/caller.service'
import { HttpResponse, HttpStatusCode } from '@angular/common/http'
import { PpaModel } from '../ngrx-store/app.state'
import { LeaveReviewComponent } from '../dialogs/leave-review/leave-review.component'
import { MatDialog } from '@angular/material/dialog'
import { FormControl } from '@angular/forms'
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators'

/**
 * Possible design resource:
 * 1. https://dribbble.com/shots/17513995-Search-UI-Design
 */

@Component({
    selector: 'app-all-ppas',
    templateUrl: './all-ppas.component.html',
    styleUrls: ['./all-ppas.component.css'],
})
export class AllPpasComponent implements OnInit {
    ppas: Array<PpaModel> = []
    constructor(
        private callerService: CallerService,
        public dialog: MatDialog,
    ) {}

    searchInput: FormControl = new FormControl('')

    clearSearchInput() {
        this.searchInput.setValue('')
    }

    menuState = ''

    toggleMenuState(): void {
        this.menuState = this.menuState == '' ? '_open' : ''
    }

    ngOnInit(): void {
        this.callerService.getAllPPAs().subscribe({
            next: (res: HttpResponse<any>) => {
                console.log('ppas data', res)
                if (res.status === HttpStatusCode.Ok) {
                    this.ppas = res.body.ppas
                } // TODO: need else block?
            },
            error: (err) => {
                this.callerService.showNotification('Failed to retrieve PPAs')
            },
        })

        this.searchInput.valueChanges
            .pipe(
                filter((value) => !!value?.trim()), // don't bother with empty strings
                debounceTime(500),
                distinctUntilChanged(),
            )
            .subscribe((value) => {
                console.log('searching...', value)

                this.callerService.searchPPAs({ searchText: value }).subscribe({
                    next: (res: HttpResponse<any>) => {
                        console.log('done searching', res)
                        if (res.status === HttpStatusCode.Ok) {
                            this.ppas = res.body?.ppas
                        }
                    },
                    error: (err) => {
                        console.log('ERR searching', err)
                    },
                })
            })
    }

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
