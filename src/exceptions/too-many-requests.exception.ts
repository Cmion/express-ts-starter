import HttpStatus from '../enums/http-status.enum';
import { HttpResponse } from '../enums/http-response.enum';
import HttpException from './http.exception';

export class TooManyRequestsException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpResponse.TOO_MANY_REQUESTS.message, HttpStatus.TOO_MANY_REQUESTS);
  }
}

export default TooManyRequestsException;
