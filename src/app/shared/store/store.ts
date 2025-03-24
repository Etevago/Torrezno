import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { AppState } from '../shared.model';

@Injectable({
  providedIn: 'root',
})
export class TorrentStore extends ComponentStore<AppState> {
  readonly results = this.selectSignal((state: AppState) => state?.results);

  readonly setResults = this.updater<AppState['results']>(
    (state, results): AppState => ({ ...state, results })
  );

  readonly search = this.selectSignal((state: AppState) => state?.search);

  readonly setSearch = this.updater<AppState['search']>(
    (state, search): AppState => ({ ...state, search })
  );

  readonly filters = this.selectSignal((state: AppState) => state?.filters);

  readonly setFilters = this.updater<AppState['filters']>(
    (state, filters): AppState => ({ ...state, filters })
  );

  readonly getFilter = (id: string) =>
    this.selectSignal((state: AppState) => this._findFilter(id, state.filters));

  constructor() {
    super({
      results: [],
      search: null,
      filters: { rarbg: true, elamigos: true, '1337x': true },
    });
  }

  private _findFilter(id: string, filters: Record<string, boolean>) {
    return Object.keys(filters).find((filter) => filter === id);
  }
}
