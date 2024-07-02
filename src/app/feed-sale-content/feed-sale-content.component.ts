import { Component, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { CallerService } from '../services/caller.service'
import { HouseDetailDialogComponent } from '../dialogs/house-detail-dialog/house-detail-dialog.component'
import { Clipboard } from '@angular/cdk/clipboard'
import { SaleType } from '../ngrx-store/app.state'
import { newMessage } from '../ngrx-store/actions/corp-member.actions'
import { Router } from '@angular/router'


@Component({
    selector: 'app-feed-sale-content',
    templateUrl: './feed-sale-content.component.html',
    styleUrls: ['./feed-sale-content.component.css'],
})
export class FeedSaleContentComponent {
    constructor(
        private dialog: MatDialog,
        private clipboard: Clipboard,
        private snackBar: MatSnackBar,
        public callerService: CallerService,
        private router: Router,
    ) {}

    @Input() sale!: SaleType;

    likeState = false
    bookmarkState = false
    favoriteState = false

    /**
     * copied from https://github.com/angular/components/issues/15578#issuecomment-475792789
     */
    protected get toggleLikeState(): '_border' | '' {
        return this.likeState ? '' : '_border'
    }

    protected get toggleBookmarkIcon(): 'bookmark_border' | 'bookmark' {
        return this.bookmarkState ? 'bookmark' : 'bookmark_border'
    }

    protected get toggleFavoriteIcon(): 'favorite_border' | 'favorite' {
        return this.favoriteState ? 'favorite' : 'favorite_border'
    }

    get salePosterDisplayName(): string {
        return this.sale.CorpMember?.nickname ?? this.sale.CorpMember?.first_name ?? "Chuks Jr."
    }

    bookmarkPost() {
        console.log('bookmarking', this.sale.id);

        if (this.bookmarkState) {
            this.callerService.unBookmarkSale(this.sale.id).subscribe((res) => {
                console.log('unBookmarkSale res', res);
                this.bookmarkState = !this.bookmarkState
            }, (err) => {
                console.log('ERR unbokrm', err);
                this.callerService.showNotification(err?.error?.message ?? "Failed to remove bookmark item")
            })
        } else {
            this.callerService.bookmarkSale(this.sale.id).subscribe((res) => {
                console.log('bookmarkSale res', res);
                this.bookmarkState = !this.bookmarkState
            }, (err) => {
                console.log('ERR bkmk', err);
                this.callerService.showNotification(err?.error?.message ?? "Failed to bookmark item")
            })
        }
    }

    favoritePost() {
        console.log('liking', this.sale.id);

        if (this.favoriteState) {
            this.callerService.unLikeSale(this.sale.id).subscribe((res) => {
                console.log('unLikeSale res', res);
                this.favoriteState = !this.favoriteState
            }, (err) => {
                console.log('ERR unlike', err);
                this.callerService.showNotification(err?.error?.message ?? "Failed to unlike item")
            })
        } else {
            this.callerService.likeSale(this.sale.id).subscribe((res) => {
                console.log('likeSale res', res);
                this.favoriteState = !this.favoriteState
            }, (err) => {
                console.log('ERR like', err);
                this.callerService.showNotification(err?.error?.message ?? "Failed to like item")
            })
        }
    }

    seeHouseDetails(): void {
        const dialogRef = this.dialog.open(HouseDetailDialogComponent, {
            width: '100%',
            height: '100%',
            maxWidth: '100vw',
            maxHeight: '100vh',
            data: {},
            ariaLabel: 'Details of the house you just clicked',
        })

        /* record that this house was seen, probably record how long it was seen. tell the agent who posted it? */
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed')
        })
    }

    copyAgentPhoneNumber(): void {
        const copy = this.clipboard.copy('08056423456')
        if (copy) {
            this.snackBar.open('Copied phone number.', 'Good', {
                duration: 2000,
            })
        } else {
            this.snackBar.open('Copying failed. Try again?', 'Close', {
                duration: 2000,
            })
        }
    }

    /**
     * chatee = Message receiver
     * 
     * Update the app state;
     * Use effects to fetch the details of the "chatee";
     * Move the "chatee" to the top of the queue;
     * The navigate to /messages;
     * All the while showing a loader?
     */
    chatWithSalePoster(): void {
        if (this.sale.CorpMember?.state_code) {
            // Start a new message.
            this.callerService._store.dispatch(newMessage({
                room: window.crypto.randomUUID(),
                recipient_id: this.sale.CorpMember?.id,
                recipient_name: this.sale.CorpMember.first_name ?? this.sale.CorpMember.nickname,
                initiator_name: this.callerService.corpMember.first_name,
                initiator_id: this.callerService.corpMember.id,
            }))
            /**
             * Then navigate to messages, after successful dispatch (all the while showing a loader?)
             * TODO: Can we wait till the dispatch is done? Or no need (works now though)?
             */

            this.router.navigate(['/messages'])
        } else {
            this.callerService.showNotification("Sorry, we couldn't find the seller.")
        }
    }
}
