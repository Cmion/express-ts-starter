import HttpStatus from '../enums/http-status.enums';
import { HttpError } from '../utils/constants/http-errors.contants';
import HttpException from './http.exceptions';

class InternalServerErrorException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpError['INTERNAL_SERVER_ERROR'].message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default InternalServerErrorException;