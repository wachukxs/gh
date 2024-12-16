import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { CallerService } from '../../services/caller.service'
import { PpaModel } from '../../ngrx-store/app.state'

@Component({
    selector: 'app-more-view-search',
    templateUrl: './more-view-search.component.html',
    styleUrls: ['./more-view-search.component.css'],
})
export class MoreViewSearchComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { ppa: PpaModel | any },
        private moreViewDialogRef: MatDialogRef<MoreViewSearchComponent>,
        private callerService: CallerService,
    ) {}

    ngOnInit(): void {
        console.log('data=', this.data)
    }

    close(): void {
        this.moreViewDialogRef.close()
    }

    /**
     * 
     */
    starCountArray(count: number | null) {
        return (count ? Array.from(`${count}`.repeat(count)) : []).concat(
            Array(5 - (count ?? 0)).fill(null),
        )
    }
}
