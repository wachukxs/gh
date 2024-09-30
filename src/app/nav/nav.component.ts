import { Component, OnInit, ViewChild } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import { MatMenuTrigger } from '@angular/material/menu'
import { CreateNewAccommodationComponent } from '../dialogs/create-new-accommodation/create-new-accommodation.component'
import { MatDialog } from '@angular/material/dialog'
import { CreateNewSaleComponent } from '../dialogs/create-new-sale/create-new-sale.component'
import { AddNewPlaceDialogComponent } from '../dialogs/add-new-place-dialog/add-new-place-dialog.component'
import { SocketIoChatNamespaceService } from '../services/socket-io.chat-ns.service'
import { IOEventName } from '../utils/types'
import { newChatMessage } from '../ngrx-store/actions/corp-member.actions'
import { AppState } from '../ngrx-store/app.state'
import { Store } from '@ngrx/store'

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | undefined

    isHandset$: Observable<boolean> = this.breakpointObserver
        .observe(Breakpoints.Handset)
        .pipe(
            map((result) => result.matches),
            shareReplay(),
        )

    menuState = ''

    /**
     * copied from https://github.com/angular/components/issues/15578#issuecomment-475792789
     * with a bit of refactor.
     */
    toggleMenuState(): void {
        this.menuState = this.menuState == '' ? '_open' : ''
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
        })

        /* record that this house was seen, probably record how long it was seen. tell the agent who posted it? */
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The accommodation dialog was closed')
        })
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
            })

            /* record that this house was seen, probably record how long it was seen. tell the agent who posted it? */
            dialogRef.afterClosed().subscribe((result) => {
                console.log('The accommodation dialog was closed', result)
            })
        } catch (error) {
            console.log('err opening dialog to add new ppa', error)
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
        })

        /* record that this house was seen, probably record how long it was seen. tell the agent who posted it? */
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The sale dialog was closed')
        })
    }

    logout(): void {
        localStorage.removeItem('online-corper')
        sessionStorage.removeItem('_online')
        console.log('laugh', this.router.url)
        /**
         * Using this.router.navigate(['']) or '/', if you're in the / home page, won't navigate since the url doesn't change.
         */
        this.router.navigate(['/login'])
    }

    constructor(
        private breakpointObserver: BreakpointObserver,
        public store: Store<AppState>,
        private router: Router,
        private dialog: MatDialog,
        private socketIoChatNamespaceService: SocketIoChatNamespaceService,
    ) {}

    ngOnInit() {
        /**
         * NB: The event listeners has to be on the page you want to listen to that event on (or on any component that is rendered).
         * If it's on a different page (one that isn't rendered), it won't pick it up.
         * So put the same event listeners on all the page you want to listen to it on.
         * Not just in one place. It will only get listened to on the current page of the app if it's there.
         * 
         * I'm putting it in the nav bar because the nav bar is always visible. (BUT SOMETIMES IT DOESN'T WORK)
         * Maybe we just need some counter? Of how many unread messages a corper has.
         */
        
    }
}
