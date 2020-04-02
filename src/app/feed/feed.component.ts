import { Component, OnInit } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { FactService } from '../fact.service';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

import { FormControl } from '@angular/forms';

export interface Fact { // change to property
  text?: string;
  date?: string;
}

interface Pokemon {
  value: string;
  viewValue: string;
}

interface PokemonGroup {
  disabled?: boolean;
  name: string;
  pokemon: Pokemon[];
}

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  places = new FormControl();
  placesList: string[] = [
    'Bodija', 'Aare', 'Lagos', 'Surelere', 'Iwo', 'Zamfara',
    'Osun', 'Ibafo', 'Mowe', 'Mile 12', 'Jos', 'Umuahia',
    'Kano', 'Kaduna', 'Port H.', 'Bende', 'Water G.', 'Ford'
  ];

  pokemonControl = new FormControl();
  pokemonGroups: PokemonGroup[] = [
    {
      name: 'Grass',
      pokemon: [
        {value: 'bulbasaur-0', viewValue: 'Bulbasaur'},
        {value: 'oddish-1', viewValue: 'Oddish'},
        {value: 'bellsprout-2', viewValue: 'Bellsprout'}
      ]
    },
    {
      name: 'Water',
      pokemon: [
        {value: 'squirtle-3', viewValue: 'Squirtle'},
        {value: 'psyduck-4', viewValue: 'Psyduck'},
        {value: 'horsea-5', viewValue: 'Horsea'}
      ]
    },
    {
      name: 'Fire',
      disabled: true,
      pokemon: [
        {value: 'charmander-6', viewValue: 'Charmander'},
        {value: 'vulpix-7', viewValue: 'Vulpix'},
        {value: 'flareon-8', viewValue: 'Flareon'}
      ]
    },
    {
      name: 'Psychic',
      pokemon: [
        {value: 'mew-9', viewValue: 'Mew'},
        {value: 'mewtwo-10', viewValue: 'Mewtwo'},
      ]
    }
  ];

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
