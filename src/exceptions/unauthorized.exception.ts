import HttpStatus from '../enums/http-status.enums';
import HttpException from './http.exceptions';
import { HttpError } from '../utils/constants/http-errors.contants';

class UnauthorizedException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpError['BAD_REQUEST'].message, HttpStatus.UNAUTHORIZED);
  }
}

export default UnauthorizedException;
