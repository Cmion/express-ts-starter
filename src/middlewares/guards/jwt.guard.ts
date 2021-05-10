import { verify } from 'jsonwebtoken';
import { config } from '../../core/factory/service/config.service';
import { Response, Request, NextFunction } from 'express';
import { last, get } from 'lodash';
import UnauthorizedException from '../../exceptions/unauthorized.exception';
import { AccountModel } from '../../core/account/schema/account.schema';
import locale from '../../locale';
import { AppLocale } from '../../interfaces/locales.interface';
import NotFoundException from '../../exceptions/not-found.exception';

const _enumerateJWTError = (err: Error, appLocale: AppLocale) => {
  let message = get(appLocale, 'auth.authorization_error');
  if (err.name && err.name === 'TokenExpiredError') {
    message = get(appLocale, 'auth.expired_token');
  }

  return message;
};

const JWTGuard = async (request: Request, response: Response, next: NextFunction) => {
  const tokenWithBearer = request.headers['authorization'];

  const jwtToken = last(tokenWithBearer?.split?.(' ') ?? []);

  const serverSecret = config.get<string>('app.secrets.server_secret');

  const appLocale = await locale.get(request?.locale);

  if (jwtToken) {
    // Verify JWT Token.
    verify(jwtToken, serverSecret, { ignoreExpiration: false }, async (err, decoded) => {
      if (err) {
        let message = _enumerateJWTError(err, appLocale);
        return next(new UnauthorizedException(message));
      }

      const accountId = get(decoded, 'accountId', '');
      request.accountId = accountId;
      const account = await AccountModel.findById(accountId).exec();

      if (!account) {
        return next(new NotFoundException(get(appLocale, 'auth.account_not_found')));
      }
      next();
    });
  }

  if (!jwtToken) return next(new UnauthorizedException(get(appLocale, 'auth.invalid_user_access')));
};

export default JWTGuard;
