import HttpStatus from '../enums/http-status.enum';
import { AppResponseInterface } from '../interfaces/app-response.interface';
import { ResponseMeta } from '../interfaces/response-meta.interface';
import { Pagination } from './pagination.class';

export class AppResponse {
  // static toResponse(meta:)
  static metaDefaults() {
    return { code: HttpStatus.OK };
  }
  static toMeta(option: any): ResponseMeta {
    const meta: ResponseMeta = AppResponse.metaDefaults();
    if (option?.token) {
      meta.token = option.token;
    }
    if (option?.pagination) {
      meta.pagination = Pagination.fromObject(option?.pagination);
    }

    if (option?.message) {
      meta.message = option?.message;
    }

    if (option?.description) {
      meta.description = option?.description;
    }

    if (option?.details) {
      meta.details = option?.details;
    }

    if (option?.code) {
      meta.code = option?.code;
    }

    if (option?.http_response) {
      meta.http_response = option?.http_response;
    }

    return meta;
  }

  static toResponse(options: any): AppResponseInterface {
    const response: AppResponseInterface = Object.assign({}, { meta: AppResponse.toMeta(options) });
    if (options?.value) response.data = options.value;
    return response;
  }
}
