export interface Result {
  name: string;
  size?: string;
  time?: string;
  convertedSize?: number;
  seeders?: number;
  leechers?: number;
  link?: string;
  source: string;
  // category?: string;
  img?: string;
}

export interface SortEvent {
  field?: string;
  order?: string;
}

export interface SearchRequest extends SortEvent {
  search?: string;
}

export interface AppState {
  results: Result[];
  search: SearchRequest | null;
  filters: Record<string, boolean>;
}
