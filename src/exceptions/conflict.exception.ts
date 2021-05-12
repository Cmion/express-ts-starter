import HttpStatus from '../enums/http-status.enum';
import { HttpResponse } from '../enums/http-response.enum';
import HttpException from './http.exception';

export class ConflictException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpResponse.CONFLICT.message, HttpStatus.CONFLICT);
  }
}

export default ConflictException;
