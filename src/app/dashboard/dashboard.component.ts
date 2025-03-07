import { Component, OnInit } from '@angular/core';
import { ResultsComponent } from './results/results.component';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [SearchComponent, ResultsComponent],
})
export class DashboardComponent implements OnInit {

  constructor() {}

  ngOnInit() {

  }
}
