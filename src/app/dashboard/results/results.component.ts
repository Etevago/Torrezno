import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  imports: [FormsModule, ReactiveFormsModule],
})
export class ResultsComponent implements OnInit {
  currentPage: number = 1;
  totalPages!: number;
  results: any[] = [];

  rarbg!: boolean;
  elamigos!: boolean;
  hacker!: boolean;

  constructor() {}

  ngOnInit() {}


  filterResults() {
    console.log(this.rarbg);
    console.log(this.elamigos);
    console.log(this.hacker);
  }

  previousPage() {}

  nextPage() {}
}
