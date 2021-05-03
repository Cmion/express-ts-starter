import { Paginate } from '../interfaces/pagination.interface';
import { clamp } from 'lodash';

export class Pagination {
  private static defaults(): Paginate {
    return {
      total: 0,
      current: 1,
      next: 2,
      prev: 1,
      per_page: 10,
    };
  }
  static toObject(options: any): Paginate {
    const pagination = Pagination.defaults();
    pagination.total = options?.total ?? 0;
    pagination.current = options?.current ?? 1;
    pagination.per_page = options?.per_page ?? 10;

    if (options?.next) {
      pagination.next = clamp(
        options?.next,
        pagination.current + 1,
        pagination.current + 1,
      );
    }
    if (options?.prev) {
      pagination.prev = clamp(
        options?.prev,
        pagination.current - 1,
        pagination.current - 1,
      );
    }

    return pagination;
  }
}
