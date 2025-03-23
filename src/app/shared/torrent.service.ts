import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  linkedSignal,
  signal
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
    filters: { rarbg: true, elamigos: true, '1337x': true },
  });

  // Sources
  search$ = new Subject<SearchRequest>();

  // Selectors
  results = computed(() => this.state().results);
  search = computed(() => this.state().search);
  filters = computed(() => this.state().filters);
  filteredResults = linkedSignal(() =>
    this.results().filter((result) =>
      this.filterResponses(result, this.filters())
    )
  );

  // Reducers
  constructor() {
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
          this.state.update((state) => ({
            ...state,
            results: responses.flat(),
          }));
        });
    });
  }

  // Filter reducer
  filterChanged(value: boolean, target: string) {
    this.state.update((state) => ({
      ...state,
      filters: {
        ...state.filters,
        [target]: value,
      },
    }));
  }

  filterResponses(result: Result, filters: Record<string, boolean>): boolean {
    const filter = Object.keys(filters!)
      .filter((key) => filters![key])
      .join('');
    return filter.includes(result.source.toLowerCase());
  }


}
