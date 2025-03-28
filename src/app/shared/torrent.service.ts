import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  linkedSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, forkJoin, Observable, Subject } from 'rxjs';
import { RestApiService } from './rest-api.service';
import { Result, SearchRequest } from './shared.model';
import { TorrentStore } from './store/store';

@Injectable({
  providedIn: 'root',
})
export class TorrentService {
  private apiService = inject(RestApiService);
  private destroyRef = inject(DestroyRef);
  private store = inject(TorrentStore);

  // Sources
  search$ = new Subject<SearchRequest>();

  // Selectors
  results = computed(() => this.store.results());
  search = computed(() => this.store.search());
  filters = computed(() => this.store.filters());
  filteredResults = linkedSignal(() =>
    this.results().filter(this.filterResponses.bind(this))
  );

  // Reducers
  constructor() {
    // Search and results reducer
    this.search$
      .pipe(
        distinctUntilChanged((prev, curr) => {
          return JSON.stringify(prev) == JSON.stringify(curr);
        }),
        takeUntilDestroyed()
      )
      .subscribe((search) => {
        this.store.setSearch(search);

        let requests: Array<Observable<Result[]>> = [
          this.apiService.getRARBGTorrents(search),
          this.apiService.getHackerTorrents(search),
          this.apiService.getElAmigosTorrents(search.search!),
        ];

        forkJoin(requests)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((responses) => {
            this.store.setResults(responses.flat());
          });
      });
  }

  // Filter reducer
  filterChanged(value: boolean, target: string) {
    this.store.setFilters({
      ...this.filters(),
      [target]: value,
    });
  }

  filterResponses(result: Result): boolean {
    const filter = Object.keys(this.filters())
      .filter((key) => this.filters()[key])
      .join('');
    return filter.includes(result.source.toLowerCase());
  }
}
