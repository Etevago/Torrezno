import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports: [FormsModule],
})
export class SearchComponent implements OnInit {

  searchInput!: string;

  constructor() {}

  ngOnInit() {}

  onSearch() {}
}
