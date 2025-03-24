import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SortEvent } from '../../shared/shared.model';
import { TorrentStore } from '../../shared/store/store';
import { TorrentService } from '../../shared/torrent.service';
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  imports: [TableModule, FormsModule, ReactiveFormsModule],
})
export class ResultsComponent {
  protected service = inject(TorrentService);
  protected store = inject(TorrentStore);

  displayedColumns: string[] = [
    'img',
    'name',
    // 'category',
    'added',
    'size',
    'seeders',
    'leechers',
    'source',
  ];

  filters = this.store.filters();

  sortChanged(event: any) {
    const { field, order } = event;
    this.service.search$.next({
      search: this.service.search()?.search,
      field,
      order: order === 1 ? 'asc' : 'desc',
    });
  }
}
