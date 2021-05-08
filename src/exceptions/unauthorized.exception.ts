import HttpStatus from '../enums/http-status.enums';
import HttpException from './http.exceptions';
import { HttpError } from '../utils/constants/http-errors.contants';

class UnauthorizedException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpError.UNAUTHORIZED.message, HttpStatus.UNAUTHORIZED);
  }
}

export default UnauthorizedException;
