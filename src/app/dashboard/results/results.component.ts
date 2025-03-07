import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Result } from '../../shared/shared.model';
import { TorrentService } from '../../shared/torrent.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
  ],
})
export class ResultsComponent implements OnInit {
  protected torrentService = inject(TorrentService);

  results: Result[] = [];
  tableData!: MatTableDataSource<Result, MatPaginator>;
  displayedColumns: string[] = ['name', 'magnet', 'link', 'source']; // 'size', 'seeders', 'leechers', 'source'];

  rarbg = true;
  elamigos = true;
  hacker = true;

  constructor() {}

  ngOnInit() {
    this.torrentService.results$.subscribe((results) => {
      this.results = results;
      this.tableData = new MatTableDataSource(results);
    });
  }

  filterChanged() {
    this.torrentService.filters$.next([this.rarbg, this.elamigos, this.hacker]);
  }

  previousPage() {}

  nextPage() {}
}
