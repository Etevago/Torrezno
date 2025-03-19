import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { ApiRequest as SearchRequest, Result, SortEvent } from './shared.model';
import { RestApiService } from './rest-api.service';

@Injectable({
  providedIn: 'root',
})
export class TorrentService {
  results$: Subject<Result[]> = new Subject<Result[]>();
  search$: Subject<SearchRequest> = new Subject<SearchRequest>();

  private apiService = inject(RestApiService);

  constructor() {
    this.search$.subscribe((search) => {
      this.onSearch(search);
    });
  }

  private onSearch(search: SearchRequest) {
    let requests: Array<Observable<Result[]>> = [
      this.apiService.getRARBGTorrents(search),
      this.apiService.getHackerTorrents(search),
      this.apiService.getElAmigosTorrents(search.search),
    ];

    forkJoin(requests).subscribe((responses) => {
      this.results$.next(responses.flat());
    });
  }
}
