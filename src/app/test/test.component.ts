import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements OnInit {

  constructor() { }

  ds = new MyDataSource();

  ngOnInit() {
  }
  
  /**@param index the index of the item that was just scrolled past
   * @type number
   */
  scrollHandler(evt: any) {
    console.log('scroll evt', evt)
  }

}

export class MyDataSource extends DataSource<string | undefined> {
  private _length = 100000;
  private _pageSize = 100;
  private _cachedData = Array.from<string>({length: this._length});
  private _fetchedPages = new Set<number>();
  private _dataStream = new BehaviorSubject<(string | undefined)[]>(this._cachedData);
  private _subscription = new Subscription();

  connect(collectionViewer: CollectionViewer): Observable<(string | undefined)[]> {
    console.log('called connet');

    /**range at any point in time is usually 11 items, 3 before the first time in view
     * and 5 after the last item in view
     * scroll past 3 items and the range refreshed/change
     * 
     * how I think we'll use it? we'll always fetch for items greater than the end...
     * if we don't have it cached.
     */
    this._subscription.add(collectionViewer.viewChange.subscribe(range => {
      console.log('range:', range);

      const startPage = this._getPageForIndex(range.start);
      const endPage = this._getPageForIndex(range.end - 1);
      for (let i = startPage; i <= endPage; i++) {
        this._fetchPage(i);
      }
    }));
    return this._dataStream;
  }

  disconnect(): void {
    this._subscription.unsubscribe();
  }

  private _getPageForIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  private _fetchPage(page: number) {
    if (this._fetchedPages.has(page)) {
      return;
    }
    this._fetchedPages.add(page);

    // Use `setTimeout` to simulate fetching data from server.
    setTimeout(() => {
      this._cachedData.splice(page * this._pageSize, this._pageSize,
          ...Array.from({length: this._pageSize})
              .map((_, i) => `Item #${page * this._pageSize + i}`));
      this._dataStream.next(this._cachedData);
    }, Math.random() * 1000 + 200);
  }
}
