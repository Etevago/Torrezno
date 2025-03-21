import {
  Component,
  inject,
  Input
} from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Result, SortEvent } from '../../shared/shared.model';
import { TorrentService } from '../../shared/torrent.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
})
export class ResultsComponent {
  @Input({ required: true }) results!: Result[];


  protected service = inject(TorrentService);

  dataSource: MatTableDataSource<Result> = new MatTableDataSource<Result>([]);
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
