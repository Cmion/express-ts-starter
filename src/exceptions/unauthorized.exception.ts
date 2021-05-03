import HttpStatus from '../enums/http-status.enums';
import BaseException from './base.exceptions';

class UnauthorizedException extends BaseException {
  constructor(message: string | Record<string, any>) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export default UnauthorizedException;
