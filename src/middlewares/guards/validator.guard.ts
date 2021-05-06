import { Response, Request, NextFunction } from 'express';
import Validator from 'validatorjs';
import BadRequestException from '../../exceptions/bad-request.exception';
import InternalServerErrorException from '../../exceptions/internal-server.exception';

const ValidatorGuard = (rules: Record<string, any>) => async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (request.method === 'POST') {
    try {
      const body = request.body;
      const validator = new Validator(body, rules);

      const passed = validator.passes();
      if (!passed) {
        const errors = validator.errors.all();
        return next(new BadRequestException(errors));
      }
      return next();
    } catch (e) {
      return next(new InternalServerErrorException());
    }
  }

  return next();
};

export default ValidatorGuard;
