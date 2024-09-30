import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CallerService } from '../services/caller.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  results: Array<any> = []
  constructor(
      private callerService: CallerService,
      public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.callerService.getAllItems().subscribe({
      next: (res: HttpResponse<any>) => {
          console.log('items data', res)
          if (res.status === HttpStatusCode.Ok) {
              this.results = res.body.data
          } // TODO: need else block?
      },
      error: (err) => {
          this.callerService.showNotification('Failed to retrieve PPAs')
      },
  })
  }

    searchInput: FormControl = new FormControl('')

    clearSearchInput() {
        this.searchInput.setValue('')
    }

    menuState = ''

    toggleMenuState(): void {
        this.menuState = this.menuState == '' ? '_open' : ''
    }
}
