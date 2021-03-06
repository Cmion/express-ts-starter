import HttpStatus from '../enums/http-status.enum';
import HttpException from './http.exception';
import { HttpResponse } from '../enums/http-response.enum';

export class ForbiddenException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpResponse.FORBIDDEN.message, HttpStatus.FORBIDDEN);
  }
}

export default ForbiddenException;
