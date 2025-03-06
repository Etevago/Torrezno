import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Result } from './shared.model';

@Injectable({
  providedIn: 'root',
})
export class TorrentService {
  filters$: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>([
    true,
    true,
    true,
  ]);

  results$: Subject<Result[]> = new Subject<Result[]>();

  constructor() {}
}
