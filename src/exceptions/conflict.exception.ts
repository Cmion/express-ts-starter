import HttpStatus from '../enums/http-status.enums';
import { HttpError } from '../utils/constants/http-errors.contants';
import HttpException from './http.exceptions';

class ConflictException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpError.CONFLICT.message, HttpStatus.CONFLICT);
  }
}

export default ConflictException;
