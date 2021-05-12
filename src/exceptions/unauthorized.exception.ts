import HttpStatus from '../enums/http-status.enum';
import HttpException from './http.exception';
import { HttpResponse } from '../enums/http-response.enum';

export class UnauthorizedException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpResponse.UNAUTHORIZED.message, HttpStatus.UNAUTHORIZED);
  }
}

export default UnauthorizedException;
