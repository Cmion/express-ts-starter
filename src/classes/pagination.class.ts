import { Paginate } from '../interfaces/pagination.interface';
import {config} from '../core/factory/service/config.service';

export class Pagination {
  private static defaults(): Paginate {
    return {
      total: 0,
      current: 1,
      next: 2,
      prev: 1,
      per_page: 10,
      skip: 0,
      morePages() {
        return false;
      },
    };
  }

  static fromObject(options: any): Paginate {
    const pagination = Pagination.defaults();
    pagination.total = options?.total ?? 0;
    pagination.current = options?.current ?? options?.page ?? 1;
    pagination.per_page = options?.per_page ?? config.get<number>('api.pagination.items_per_page') ?? 10;

    pagination.next = pagination.current + 1;
    pagination.prev = pagination.current - 1;

    if (pagination.current > 1) {
      pagination.skip = pagination.prev * pagination.per_page;
    }

    pagination.morePages = (count: number) => {
      return count > pagination.per_page * pagination.current;
    };

    return pagination;
  }
}
