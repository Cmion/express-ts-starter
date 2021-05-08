import HttpStatus from '../enums/http-status.enums';
import { HttpError } from '../utils/constants/http-errors.contants';
import HttpException from './http.exceptions';

class NotFoundException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpError.NOT_FOUND.message, HttpStatus.NOT_FOUND);
  }
}

export default NotFoundException;
