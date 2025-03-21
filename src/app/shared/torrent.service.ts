import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, Observable, Subject } from 'rxjs';
import { RestApiService } from './rest-api.service';
import { AppState, Result, SearchRequest } from './shared.model';

@Injectable({
  providedIn: 'root',
})
export class TorrentService {
  private apiService = inject(RestApiService);
  private destroyRef = inject(DestroyRef);

  private state = signal<AppState>({
    results: [],
    search: null,
    filters: {
      rarbg: true,
      elamigos: true,
      '1337x': true,
    },
  });

  search$ = new Subject<SearchRequest>();
  filters$ = new Subject<Record<string, boolean>>();

  // Selectors
  results = computed(() => this.state().results);
  search = computed(() => this.state().search);
  filters = computed(() => this.state().filters);

  // Reducers
  constructor() {
    // Filters reducer
    this.filters$.pipe(takeUntilDestroyed()).subscribe((filters) => {
      this.state.update((state) => ({
        ...state,
        filters: {
          ...state.filters,
          ...filters,
        },
      }));
    });

    // Search and results reducer
    this.search$.pipe(takeUntilDestroyed()).subscribe((search) => {
      this.state.update((state) => ({
        ...state,
        search: {
          ...state.search,
          ...search,
        },
      }));

      let requests: Array<Observable<Result[]>> = [
        this.apiService.getRARBGTorrents(search),
        this.apiService.getHackerTorrents(search),
        this.apiService.getElAmigosTorrents(search.search!),
      ];

      forkJoin(requests)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((responses) => {
          console.log(this.filters());
          this.state.update((state) => ({
            ...state,
            results: responses.flatMap(this.filterResponses.bind(this)),
          }));
        });
    });
  }

  filterResponses(responses: Result[]): Result[] {
    const filter = Object.keys(this.filters())
      .filter((key) => this.filters()[key])
      .join('');
    return responses.filter((result) =>
      filter.includes(result.source.toLowerCase())
    );
  }
}
