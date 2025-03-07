import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { RestApiService } from '../../shared/rest-api.service';
import { TorrentService } from '../../shared/torrent.service';
import {
  scrapeElAmigos,
  scrapeHacker,
  scrapeRARBG,
} from '../../shared/torrent-scraper';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports: [FormsModule],
})
export class SearchComponent implements OnInit {
  private torrentService = inject(TorrentService);
  private apiService = inject(RestApiService);

  searchInput!: string;

  constructor() {}

  ngOnInit() {}

  onSearch() {
    let requests: Array<Observable<any>> = [];
    this.torrentService.filters$.value.forEach((filter, index) => {
      if (filter) {
        switch (index) {
          case 0:
            requests.push(this.apiService.getRARBGTorrents(this.searchInput));
            break;
          case 1:
            requests.push(
              this.apiService.getElAmigosTorrents(this.searchInput)
            );
            break;
          case 2:
            requests.push(this.apiService.getHackerTorrents(this.searchInput));
            break;
        }
      }
    });
    forkJoin(requests).subscribe((responses) => {
      const data = responses.map((response, index) => {
        switch (index) {
          case 0:
            return scrapeRARBG(response);
          case 1:
            return scrapeElAmigos(response);
          case 2:
            return scrapeHacker(response);
          default:
            return [];
        }
      }).flat();
      this.torrentService.results$.next(data);
    });
  }
}
