import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../environment.dev';
import { scrapeElAmigos, scrapeHacker, scrapeRARBG } from './torrent-scraper';
import { SearchRequest, Result } from './shared.model';

@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  private httpClient = inject(HttpClient);

  constructor() {}

  getRARBGTorrents(request: SearchRequest): Observable<Result[]> {
    let { search, field, order: by } = request;
    let params: any = { search };
    if (field && by) {
      if (field === 'time') field = 'data';
      params.order = field;
      params.by = by;
    }

    return this.httpClient
      .get(`${environment.rarbgApi}search/`, {
        params,
        responseType: 'text',
      })
      .pipe(
        catchError((error) => {
          console.error('RARBG API Error:', error);
          return of(null);
        }),
        map(scrapeRARBG)
      );
  }

  getHackerTorrents(request: SearchRequest): Observable<Result[]> {
    const { search, field: active, order: direction } = request;
    let searchQuery = direction
      ? `sort-search/${search}/${active}/${direction}`
      : `search/${search}`;
    return this.httpClient
      .get(`${environment.hackerApi}${searchQuery}/1`, {
        responseType: 'text',
      })
      .pipe(
        catchError((error) => {
          console.error('1377x API Error:', error);
          return of(null);
        }),
        map(scrapeHacker)
      );
  }

  getElAmigosTorrents(search: string): Observable<Result[]> {
    const params = { q: search };
    return this.httpClient
      .get(environment.elamigosApi, { params, responseType: 'text' })
      .pipe(
        catchError((error) => {
          console.error('ElAmigos API Error:', error);
          return of(null);
        }),
        map(scrapeElAmigos)
      );
  }
}
