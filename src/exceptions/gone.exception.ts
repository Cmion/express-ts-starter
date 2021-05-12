import HttpStatus from '../enums/http-status.enum';
import HttpException from './http.exception';
import { HttpResponse } from '../enums/http-response.enum';

export class GoneException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpResponse.GONE.message, HttpStatus.GONE);
  }
}

export default GoneException;
