import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TorrentService } from '../../shared/torrent.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [FormsModule],
})
export class SearchComponent implements OnInit {
  private torrentService = inject(TorrentService);

  searchInput!: string;
  constructor() {}

  ngOnInit() {}

  onSearch() {
    this.torrentService.search$.next({ search: this.searchInput });
  }
}
