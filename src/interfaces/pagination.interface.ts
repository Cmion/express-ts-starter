export interface Paginate {
  total: number;
  current: number;
  next: number;
  prev: number;
  per_page: number;
  skip: number;
  morePages(count: number): boolean;
}
