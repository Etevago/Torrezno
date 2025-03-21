import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TorrentService } from '../../shared/torrent.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [FormsModule],
})
export class SearchComponent {
  service = inject(TorrentService);
}
