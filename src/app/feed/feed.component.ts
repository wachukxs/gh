import { Component, OnInit } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { FactService } from '../fact.service';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

export interface Fact { // change to property
  text?: string;
  date?: string;
}
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  dataSource: FactsDataSource | object;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(public factService: FactService, private breakpointObserver: BreakpointObserver) {
    this.dataSource = new FactsDataSource(factService);
  }

  ngOnInit() {
    console.log('data source:', this.dataSource);
  }

}


export class FactsDataSource extends DataSource<object | Fact | undefined> {
  private cachedFacts = Array.from<object | Fact>({ length: 0 });
  private dataStream = new BehaviorSubject<(object | Fact | undefined)[]>(this.cachedFacts);
  private subscription = new Subscription();

  private pageSize = 10;
  private lastPage = 0;

  constructor(private factService: FactService) {
    super();

    // Start with some data.
    this._fetchFactPage();
  }

  private _fetchFactPage(): void {
    for (let i = 0; i < this.pageSize; ++i) {
      this.factService.getRandomFact().subscribe(res => {
        this.cachedFacts = this.cachedFacts.concat(res);
        this.dataStream.next(this.cachedFacts);
      });
    }
  }

  private _getPageForIndex(i: number): number {
    return Math.floor(i / this.pageSize);
  }

  // from DataSource interface
  connect(collectionViewer: CollectionViewer): Observable<(object | Fact | undefined)[] | ReadonlyArray<object | Fact | undefined>> {
    this.subscription.add(collectionViewer.viewChange.subscribe(range => {
      // Update the data
      const currentPage = this._getPageForIndex(range.end);

      console.log('what\'s range.end:', range.end, 'what\'s range:', range);

      if (currentPage && range) {
        console.log('current page:', currentPage, 'last page:', this.lastPage);
      }

      if (currentPage > this.lastPage) {
        this.lastPage = currentPage;
        this._fetchFactPage();
      }
    }));
    return this.dataStream;
  }
  /**
   *
   * @param collectionViewer
   * The data source is subscribed
   * to any changes in the collection viewer
   * (e.g. the user scrolls), and will then perform an action
   * and return the data stream. We are going to tell the
   * data source to get more data when we have reached the end of the list.
   */

  // from DataSource interface
  disconnect(collectionViewer: CollectionViewer): void {
    this.subscription.unsubscribe();
  }
}
