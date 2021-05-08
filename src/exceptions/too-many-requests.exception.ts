import HttpStatus from '../enums/http-status.enums';
import { HttpError } from '../utils/constants/http-errors.contants';
import HttpException from './http.exceptions';

class TooManyRequestsException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpError.TOO_MANY_REQUESTS.message, HttpStatus.TOO_MANY_REQUESTS);
  }
}

export default TooManyRequestsException;
