import { Pagination } from 'src/classes/pagination.class';

export interface ResponseMeta {
  pagination?: Pagination;
  token?: string;
  statusCode: number;
  publicId?: string;
  message?: string;
}
