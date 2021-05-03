import { verify } from 'jsonwebtoken';
import config from 'config';
import { Response, Request, NextFunction } from 'express';
import { last, get } from 'lodash';
import UnauthorizedException from '../../exceptions/unauthorized.exception';
import { AccountModel } from '../../core/account/model/account.model';

const _enumJWTError = (err: Error) => {
  let message = 'Failed to authenticate token';
  if (err.name && err.name === 'TokenExpiredError') {
    message = 'You are not logged in!';
  }

  return message;
};

const JWTGuard = (request: Request, response: Response, next: NextFunction) => {
  const tokenWithBearer = request.headers['authorization'];

  const jwtToken = last(tokenWithBearer.split(' '));

  const serverSecret = config.get<string>('app.secrets.serverSecret');

  if (jwtToken) {
    // Verify JWT Token.
    verify(jwtToken, serverSecret, { ignoreExpiration: false }, async (err, decoded) => {
      if (err) {
        let message = _enumJWTError(err);
        return next(new UnauthorizedException(message));
      }

      const authID = get(decoded, 'authID', '');
      request.authID = authID;
      const account = AccountModel.findById(authID);

      if (!account) {
        return next(new UnauthorizedException('message'));
      }
    });
  }

  return next();
};

export default JWTGuard;
