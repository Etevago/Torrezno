import { SortDirection } from '@angular/material/sort';

export interface Result {
  name: string;
  size?: string;
  added?: string;
  convertedSize?: number;
  seeders?: number;
  leechers?: number;
  link?: string;
  source: string;
  // category?: string;
  img?: string;
}

export interface SortEvent {
  active?: string;
  direction?: SortDirection;
}

export interface SearchRequest extends SortEvent {
  search?: string;
}

export interface AppState {
  results: Result[];
  search: SearchRequest | null;
  filters: Record<string, boolean>;
}
