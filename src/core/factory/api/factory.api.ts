import config from 'config';
import { Express } from 'express';
import controllers from '../../base/controller/base.controller';
import NotFoundException from '../../../exceptions/not-found.exception';
import APIKeyGuard from '../../../middlewares/guards/api-key.guard';
import BaseExceptionFilter from '../../../middlewares/filters/base-exception.filter';

const prefix = config.get<string>('api.prefix');
const version = config.get<string>('api.version');

export const APIFactory = (app: Express) => {
  app.use(prefix, APIKeyGuard);

  app.use(`/v${version}`, controllers);

  app.use((req, res, next) => {
    return next(new NotFoundException());
  });

  app.use('*', (req, res, next) => {
    return next(new NotFoundException());
  });

  app.use(BaseExceptionFilter);

  return app;
};


