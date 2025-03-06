import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TorrentService } from '../../shared/torrent.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  imports: [FormsModule, ReactiveFormsModule],
})
export class ResultsComponent implements OnInit {
  private torrentService = inject(TorrentService);

  currentPage: number = 1;
  totalPages!: number;
  results: any[] = [];

  rarbg = true;
  elamigos = true;
  hacker = true;

  constructor() {}

  ngOnInit() {}

  filterChanged() {
    this.torrentService.filters$.next([this.rarbg, this.elamigos, this.hacker]);
  }

  previousPage() {}

  nextPage() {}
}
