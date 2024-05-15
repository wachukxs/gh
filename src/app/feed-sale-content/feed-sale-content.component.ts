import { Component, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { CallerService } from '../services/caller.service'
import { HouseDetailDialogComponent } from '../dialogs/house-detail-dialog/house-detail-dialog.component'
import { Clipboard } from '@angular/cdk/clipboard'

interface MediaType {
    id: number,
    url: string,
    sale_id: number,
    updated_at: string,
    created_at: string,
}

interface SaleType {
    _price: string, // parsable to number
    _age: string,
    last_updated_age: string,
    _type: 'sale',
    id: 5,
    corp_member_id: 2,
    text: string,
    item_name: string,
    price: number,
    Media: Array<MediaType>,
    updated_at: string,
    created_at: string,

    CorpMember?: {
        first_name: string,
        nickname: null | string,
        service_state: string,
        state_code: string,
        _location: string,
    }
}

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

    bookmarkPost() {
        this.bookmarkState = !this.bookmarkState
    }

    favoritePost() {
        this.favoriteState = !this.favoriteState
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
}
