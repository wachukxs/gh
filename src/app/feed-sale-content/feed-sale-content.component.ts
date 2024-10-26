import { AfterContentInit, AfterViewChecked, Component, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { CallerService } from '../services/caller.service'
import { HouseDetailDialogComponent } from '../dialogs/house-detail-dialog/house-detail-dialog.component'
import { Clipboard } from '@angular/cdk/clipboard'
import { SaleType } from '../ngrx-store/app.state'
import { newMessage } from '../ngrx-store/actions/corp-member.actions'
import { Router } from '@angular/router'
import { HttpResponse, HttpStatusCode } from '@angular/common/http'
import { LoginSignupPromptComponent } from '../dialogs/login-signup-prompt/login-signup-prompt.component'


@Component({
    selector: 'app-feed-sale-content',
    templateUrl: './feed-sale-content.component.html',
    styleUrls: ['./feed-sale-content.component.css'],
})
export class FeedSaleContentComponent implements AfterContentInit, AfterViewChecked {
    constructor(
        private dialog: MatDialog,
        private clipboard: Clipboard,
        private snackBar: MatSnackBar,
        public callerService: CallerService,
        private router: Router,
    ) {}

    @Input() sale!: SaleType;
    @Input() showDeleteOption: boolean = false;

    likeState: boolean = false
    bookmarkState: boolean = false

    // TODO: needs to be better??
    isLoggedIn = this.callerService.corpMember?.id

    // ~show if the current user is logged in and isn't the poster of this item.~ we'll make them login
    // showChatOption = this.isLoggedIn && this.callerService.corpMember?.id !== this.sale?.corp_member_id

    ngAfterContentInit(): void {
        // in ngAfterContentInit, because it'll be initialized only once!
        
        this.likeState = !!this.sale?.SaleLikes?.[0]?.id
        this.bookmarkState = !!this.sale?.SaleBookmarks?.[0]?.id
    }

    ngAfterViewChecked(): void {

    }

    /**
     * copied from https://github.com/angular/components/issues/15578#issuecomment-475792789
     */
    protected get toggleBookmarkIcon(): 'bookmark_border' | 'bookmark' {
        return this.bookmarkState ? 'bookmark' : 'bookmark_border'
    }

    protected get toggleLikeIcon(): 'favorite_border' | 'favorite' {
        return this.likeState ? 'favorite' : 'favorite_border'
    }

    get salePosterDisplayName(): string {
        return this.sale.CorpMember?.nickname ?? this.sale.CorpMember?.first_name ?? "seller"
    }

    bookmarkPost() {
        console.log('bookmarking', this.sale.id);

        if (this.bookmarkState) {
            this.callerService.unBookmarkSale(this.sale.id).subscribe((res) => {
                console.log('unBookmarkSale res', res);
                this.bookmarkState = !this.bookmarkState
                this.callerService.showNotification("Bookmark removed!")
            }, (err) => {
                console.log('ERR unbokrm', err);
                this.callerService.showNotification(err?.error?.message ?? "Failed to remove bookmark item")
            })
        } else {
            /* What if after we bookmark, we return the whole sale object from db, and replace it in state. */
            this.callerService.bookmarkSale(this.sale.id)
            .subscribe({
                next: (res: any) => {
                    // we need to be returning http status code, maybe .PUT isn't what we should use here?
                    console.log('bookmarked sale data', res)
                    if (res?.message) {
                        this.callerService.showNotification(res.message)
                    } else if (res.data?.id) {
                        this.bookmarkState = !this.bookmarkState
                        this.callerService.showNotification("Bookmarked!")
                    } // TODO: need else block?
                },
                error: (err) => {
                    console.log('ERR bookmarking', err);
                    this.callerService.showNotification(err?.error?.message ?? "Failed to bookmark item")
                },
            })
        }
    }

    favoritePost() {
        console.log('liking', this.sale.id);

        if (this.likeState) {
            this.callerService.unLikeSale(this.sale.id).subscribe((res) => {
                console.log('unLikeSale res', res);
                this.likeState = !this.likeState
                this.callerService.showNotification("Like removed!")
            }, (err) => {
                console.log('ERR unlike', err);
                this.callerService.showNotification(err?.error?.message ?? "Failed to unlike item")
            })
        } else {
            this.callerService.likeSale(this.sale.id).subscribe((res) => {
                console.log('likeSale res', res);
                this.likeState = !this.likeState
                this.callerService.showNotification("Liked!")
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
        // TODO: show a login prompt if they're not logged in.
        if (!this.isLoggedIn) {
            this.openLoginOrSignIn()
        } else if (this.sale.CorpMember?.state_code) {
            // Start a new message.
            // TODO: how do you handle a chat with someone you already have existing chat with?
            // TODO: if you've chatted with this person before, we should also load the sale with the room id of your chat.
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

    openLoginOrSignIn(): void {
        const confirm = this.dialog.open(LoginSignupPromptComponent, {
            maxWidth: '360px',
            data: {},
        })

        confirm.afterClosed().subscribe(
            (res: any) => {
                console.log('closed review modal', res)
            },
            (err: any) => {
                // might never get here, to err
                console.log(`exit confirmation Dialog error:`, err)
            },
        )
    }

    deletePost() {
        // TODO: extra check, (here in FE), that they made this post.
        // TODO: have a confirmation modal
        if (this.sale?.corp_member_id === this.callerService.corpMember.id) {
            this.callerService.deletePostedItem({id: this.sale.id, type: 'sale'})
            .subscribe((res) => {
                console.log('delete sale res', res);
                this.callerService.showNotification("Sale deleted!")
            }, (err) => {
                console.log('ERR deleting sale', err);
                this.callerService.showNotification(err?.error?.message ?? "Failed to delete sale")
            })
        } else {
            this.callerService.showNotification("Sale is not yours to delete")
        }
    }
}
