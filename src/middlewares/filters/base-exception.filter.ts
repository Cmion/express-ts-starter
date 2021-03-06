import { config } from '../../core/factory/service/config.service';
import { Response, Request, NextFunction } from 'express';
import HttpException from '../../exceptions/http.exception';
import { ResponseMeta } from '../../interfaces/response-meta.interface';
import { AppResponse } from '../../classes/app-response.class';
import { HttpResponse } from '../../enums/http-response.enum';
import logger from '../../setup/logger.setup';

/**
 * Filters HTTP Errors and formats them properly
 * @param error
 * @param request
 * @param response
 * @param next
 * @returns
 */
const ExceptionFilter = (error: any, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof HttpException) {
    const meta: ResponseMeta = AppResponse.toMeta(error ?? {});
    return response.status(error?.http_response?.status ?? 500).json(meta);
  }

  if (config.get<string>('app.environment') !== 'production') {
    logger.debug(error);
  }

  return response.status(error?.status ?? 500).json(
    AppResponse.toMeta(
      Object.assign(
        {},
        {
          http_response: {
            message: HttpResponse[error?.status ?? '500'].message,
            status: HttpResponse[error?.status ?? '500'].code,
          },
        },
        HttpResponse[error?.status ?? '500'],
        error,
      ),
    ),
  );
};

export default ExceptionFilter;
