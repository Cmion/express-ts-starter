import HttpStatus from '../enums/http-status.enums';
import HttpException from './http.exceptions';
import { HttpError } from '../utils/constants/http-errors.contants';

class ForbiddenException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpError['FORBIDDEN'].message, HttpStatus.FORBIDDEN);
  }
}

export default ForbiddenException;
