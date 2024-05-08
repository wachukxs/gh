import { Component, Input } from '@angular/core'
import { HouseDetailDialogComponent } from '../dialogs/house-detail-dialog/house-detail-dialog.component'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { CallerService } from '../services/caller.service'
import { Clipboard } from '@angular/cdk/clipboard'

@Component({
    selector: 'app-feed-accommodation-content',
    templateUrl: './feed-accommodation-content.component.html',
    styleUrls: ['./feed-accommodation-content.component.css'],
})
export class FeedAccommodationContentComponent {
    @Input() accommodation: any // TODO: Define accommodation Type

    constructor(
      private dialog: MatDialog,
      private clipboard: Clipboard,
      private snackBar: MatSnackBar,
      public callerService: CallerService,
  ) {}

    likeState = false
    bookmarkState = false
    favouriteState = false

    /**
     * copied from https://github.com/angular/components/issues/15578#issuecomment-475792789
     */
    protected get toggleLikeState(): '_border' | '' {
        return this.likeState ? '_border' : ''
    }

    protected get toggleBookmarkIcon(): 'bookmark_border' | 'bookmark' {
        return this.bookmarkState ? 'bookmark_border' : 'bookmark'
    }

    protected get toggleFavouriteIcon(): 'favorite_border' | 'favorite' {
        return this.favouriteState ? 'favorite_border' : 'favorite'
    }
    
    bookmarkPost() {
        this.bookmarkState = !this.bookmarkState
    }

    favouritePost() {
        this.favouriteState = !this.favouriteState
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
      const copy = this.clipboard.copy('080 564 23456')
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
