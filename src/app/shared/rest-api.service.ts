import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  private httpClient = inject(HttpClient);

  constructor() {}

  getRARBGTorrents(search: string) {
    const params = { search };
    return this.httpClient.get(`/api/rarbg.to/search/`, { params }).pipe(
      catchError((error) => {
        console.error('RARBG API Error:', error);
        return of(null);
      })
    );
  }

  getElAmigosTorrents(search: string) {
    const params = { q: search };
    return this.httpClient.get('/api/elamigos-games.net', { params }).pipe(
      catchError((error) => {
        console.error('ElAmigos API Error:', error);
        return of(null);
      })
    );
  }

  getHackerTorrents(search: string) {
    return this.httpClient.get(`/api/1377x.to/search/${search}/1`).pipe(
      catchError((error) => {
        console.error('1377x API Error:', error);
        return of(null);
      })
    );
  }
}
