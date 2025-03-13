import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Result, SortEvent } from '../../shared/shared.model';
import { TorrentService } from '../../shared/torrent.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
})
export class ResultsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected torrentService = inject(TorrentService);

  results: Result[] = [];
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

  filters: Record<string, boolean> = {
    rarbg: true,
    elamigos: true,
    '1337x': true,
  };
  search!: string;

  constructor() {}

  ngOnInit() {
    this.torrentService.results$.subscribe((results) => {
      this.results = results;
      this.dataSource.data = results;
      this.sort = new MatSort();
    });
    this.torrentService.search$.subscribe((search) => {
      this.search = search.search;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sort.disableClear = true;
    this.sort.start = 'desc';
  }

  sortChanged(event: SortEvent) {
    const { active, direction } = event;
    this.torrentService.search$.next({
      active,
      direction,
      search: this.search,
    });
  }

  filterChanged() {
    const filter = Object.keys(this.filters)
      .filter((key) => this.filters[key])
      .join('');
    const filteredData = this.results.filter((result) =>
      filter.includes(result.source.toLowerCase())
    );
    this.dataSource.data = filteredData;
  }
}
