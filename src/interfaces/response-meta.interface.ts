import { Pagination } from '../classes/pagination.class';
import { ResponseError } from './response-error.interface';

export interface ResponseMeta extends ResponseError {
  pagination?: Pagination;
  token?: string;
  publicId?: string;
  message?: string;
  error?: string;
}
