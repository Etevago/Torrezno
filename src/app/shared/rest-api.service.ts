import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  private httpClient = inject(HttpClient);

  constructor() {}

  getRARBGTorrents(search: string): Observable<any> {
    const params = { search };
    return this.httpClient
      .get(`/api/rarbg.to/search/`, { params, responseType: 'text' })
      .pipe(
        catchError((error) => {
          console.error('RARBG API Error:', error);
          return of(null);
        })
      );
  }

  getElAmigosTorrents(search: string): Observable<any> {
    const params = { q: search };
    return this.httpClient
      .get('/api/elamigos-games.net', { params, responseType: 'text' })
      .pipe(
        catchError((error) => {
          console.error('ElAmigos API Error:', error);
          return of(null);
        })
      );
  }

  getHackerTorrents(search: string): Observable<any> {
    return this.httpClient
      .get(`/api/1377x.to/search/${search}/1`, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          console.error('1377x API Error:', error);
          return of(null);
        })
      );
  }
}
