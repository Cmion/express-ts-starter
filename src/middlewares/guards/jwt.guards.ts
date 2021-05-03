import { verify } from 'jsonwebtoken';
import config from 'config';
import { Response, Request, NextFunction } from 'express';
import { last, get } from 'lodash';
import UnauthorizedException from '../../exceptions/unauthorized.exception';
import { AccountModel } from '../../core/account/model/account.model';
import locale from '../../locale';
import { AppLocale } from '../../interfaces/locales.interface';
import SupportedLocales from '../../enums/supported-locale.enums';

const _enumerateJWTError = (err: Error, appLocale: AppLocale) => {
  let message = get(appLocale, 'auth.authorizationError');
  if (err.name && err.name === 'TokenExpiredError') {
    message = get(appLocale, 'auth.expiredToken');
  }

  return message;
};

const JWTGuard = (request: Request, response: Response, next: NextFunction) => {
  const tokenWithBearer = request.headers['authorization'];

  const jwtToken = last(tokenWithBearer.split(' '));

  const serverSecret = config.get<string>('app.secrets.serverSecret');

  const appLocale = locale.get(request?.locale ?? SupportedLocales.EN);

  if (jwtToken) {
    // Verify JWT Token.
    verify(jwtToken, serverSecret, { ignoreExpiration: false }, async (err, decoded) => {
      if (err) {
        let message = _enumerateJWTError(err, appLocale);
        return next(new UnauthorizedException(message));
      }

      const authID = get(decoded, 'authID', '');
      request.authID = authID;
      const account = AccountModel.findById(authID);

      if (!account) {
        return next(new UnauthorizedException(get(appLocale, 'auth.invalidUserAccess')));
      }
    });
  }

  return next(new UnauthorizedException(get(appLocale, 'auth.invalidUserAccess')));
};

export default JWTGuard;
