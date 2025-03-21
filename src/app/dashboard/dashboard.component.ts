import { Component, inject, OnInit } from '@angular/core';
import { TorrentService } from '../shared/torrent.service';
import { ResultsComponent } from './results/results.component';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [SearchComponent, ResultsComponent],
})
export class DashboardComponent implements OnInit {
  protected service = inject(TorrentService);

  ngOnInit() {}
}
