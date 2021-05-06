import config from 'config';
import { Response, Request, NextFunction } from 'express';
import HttpException from '../../exceptions/http.exceptions';
import { ResponseMeta } from '../../interfaces/response-meta.interface';
import { AppResponse } from '../../classes/app-response.class';
import { HttpError } from '../../utils/constants/http-errors.contants';
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

  if (`${config.util.getEnv('NODE_ENV')}` !== 'production') {
    logger.debug(error);
  }

  return response.status(error?.status ?? 500).json(
    AppResponse.toMeta(
      Object.assign(
        {},
        {
          http_response: {
            message: HttpError[error?.status ?? '500'].message,
            status: HttpError[error?.status ?? '500'].code,
          },
        },
        HttpError[error?.status ?? '500'],
        error,
      ),
    ),
  );
};

export default ExceptionFilter;
