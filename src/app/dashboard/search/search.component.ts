import {
  Component,
  inject,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { RestApiService } from '../../shared/rest-api.service';
import { TorrentService } from '../../shared/torrent.service';

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
    forkJoin([
      this.apiService.getRARBGTorrents(this.searchInput),
      this.apiService.getElAmigosTorrents(this.searchInput),
      this.apiService.getHackerTorrents(this.searchInput),
    ]).subscribe((data) => {
      console.log(data);
      // this.torrentService.results$.next(data);
    });
  }
}
