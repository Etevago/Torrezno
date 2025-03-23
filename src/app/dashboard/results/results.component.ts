import { Component, inject, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Result, SortEvent } from '../../shared/shared.model';
import { TorrentService } from '../../shared/torrent.service';
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  imports: [TableModule, FormsModule,ReactiveFormsModule],
})
export class ResultsComponent {
  @Input({ required: true }) results!: Result[];

  protected service = inject(TorrentService);

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

  sortChanged(event: SortEvent) {
    const { active, direction } = event;
    this.service.search$.next({
      active,
      direction,
    });
  }
}
