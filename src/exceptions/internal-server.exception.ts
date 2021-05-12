import HttpStatus from '../enums/http-status.enum';
import { HttpResponse } from '../enums/http-response.enum';
import HttpException from './http.exception';

export class InternalServerErrorException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpResponse.INTERNAL_SERVER_ERROR.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default InternalServerErrorException;