import HttpStatus from '../enums/http-status.enum';
import { HttpResponse } from '../enums/http-response.enum';
import HttpException from './http.exception';

export class NotFoundException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpResponse.NOT_FOUND.message, HttpStatus.NOT_FOUND);
  }
}

export default NotFoundException;
