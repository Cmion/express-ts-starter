import HttpStatus from '../enums/http-status.enum';
import HttpException from './http.exception';
import { HttpResponse } from '../enums/http-response.enum';

export class UnproccessableEntityException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpResponse.UNPROCESSABLE_ENTITY.message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export default UnproccessableEntityException;
