import HttpStatus from '../enums/http-status.enums';
import { HttpError } from '../utils/constants/http-errors.contants';
import HttpException from './http.exceptions';

class BadRequestException extends HttpException {
  constructor(message?: string | Record<string, any>) {
    super(message ?? HttpError['BAD_REQUEST'].message, HttpStatus.BAD_REQUEST);
  }
}

export default BadRequestException;
