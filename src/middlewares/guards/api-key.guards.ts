import UnauthorizedException from '../../exceptions/unauthorized.exception';
import { Response, Request, NextFunction } from 'express';

const APIKeyGuard = (request: Request, response: Response, next: NextFunction) => {
  // check header or url parameters or post parameters for token
  let apiKey = (request.query.api_key || request.headers['x-api-key']) as string;
  if (!apiKey) {
    return next(new UnauthorizedException('API key absent'));
  }
  // decode token
  if (apiKey !== process.env.API_KEY && !process.env.API_KEY.includes(apiKey)) {
    return next(new UnauthorizedException());
  }
  // if there is no token, return an error
  return next();
};

export default APIKeyGuard;
