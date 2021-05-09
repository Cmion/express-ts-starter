import config from 'config';
import { Express } from 'express';
import controllers from '../../base/controller/base.controller';
import NotFoundException from '../../../exceptions/not-found.exception';
import APIKeyGuard from '../../../middlewares/guards/api-key.guard';
import BaseExceptionFilter from '../../../middlewares/filters/base-exception.filter';
import LocaleGuard from '../../../middlewares/guards/locale.guard';
import { SMSFactory } from '../sms/factory.sms';
import { MailFactory } from '../mail/factory.mail';

const prefix = config.get<string>('api.prefix');
const version = config.get<string>('api.version');

export class APIFactory {
  static configure(app: Express) {
    app.use(prefix, APIKeyGuard);
    app.use(prefix, LocaleGuard);

    app.use(`/v${version}`, controllers);

    app.use((req, res, next) => {
      return next(new NotFoundException());
    });

    app.use('*', (req, res, next) => {
      return next(new NotFoundException());
    });

    app.use(BaseExceptionFilter);

    return app;
  }

  static async $consumeWorkers() {
    await SMSFactory.$consumeWorker();
    await MailFactory.$consumeWorker();
  }
}
