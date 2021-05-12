import HttpStatus from '../enums/http-status.enum';
import { HttpResponse } from '../enums/http-response.enum';
import HttpException from './http.exception';

export class BadRequestException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpResponse.BAD_REQUEST.message, HttpStatus.BAD_REQUEST);
  }
}

export default BadRequestException;
