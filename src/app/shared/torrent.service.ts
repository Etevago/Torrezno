import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  linkedSignal,
  Signal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin, Observable, Subject } from 'rxjs';
import { RestApiService } from './rest-api.service';
import { AppState, Result, SearchRequest } from './shared.model';

@Injectable({
  providedIn: 'root',
})
export class TorrentService {
  private apiService = inject(RestApiService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  private state = signal<AppState>({
    results: [],
    search: null,
  });

  filters!: FormGroup;
  filtersControl$: Observable<any>;

  // Sources
  search$ = new Subject<SearchRequest>();

  // Selectors
  results = computed(() => this.state().results);
  search = computed(() => this.state().search);
  filteredResults = computed(() => this.filterResponses(this.results()));

  // Reducers
  constructor() {
    this.filters = this.fb.group({
      rarbg: true,
      elamigos: true,
      '1337x': true,
    });
    this.filtersControl$ = this.filters.valueChanges;

    // Filters reducer
    this.filtersControl$.pipe(takeUntilDestroyed()).subscribe((filters) => {
      this.filters.setValue(filters, { emitEvent: false });

      console.log(this.filters);
      console.log(this.filteredResults());
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
          this.state.update((state) => ({
            ...state,
            results: responses.flatMap((result) =>
              this.filterResponses(result)
            ),
          }));
        });
    });
  }

  filterResponses(results: Result[]): Result[] {
    console.log('a');
    const filter = Object.keys(this.filters.getRawValue()!)
      .filter((key) => this.filters.getRawValue()![key])
      .join('');
    return results.filter((result) =>
      filter.includes(result.source.toLowerCase())
    );
  }
}
