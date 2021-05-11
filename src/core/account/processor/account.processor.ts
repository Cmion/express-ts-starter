import { LoginDTO } from '../dto/login.dto';
import { Response, Request, NextFunction } from 'express';
import HttpStatus from '../../../enums/http-status.enums';
import { RegisterDTO } from '../dto/register.dto';
import { AccountService } from '../service/account.service';
import { VerifyDTO } from '../dto/verify.dto';

export class AccountProcessor {
  static async test(request: Request, response: Response, next: NextFunction) {
    return response.status(HttpStatus.OK).json({ data: 'testing' });
  }

  static async register(request: Request, response: Response, next: NextFunction) {
    const registerDTO = Object.assign({}, request.body) as RegisterDTO;
    const accountService = new AccountService();
    try {
      const user = await accountService.register(registerDTO, request.locale);
      return response.status(HttpStatus.CREATED).json(user);
    } catch (e) {
      next(e);
    }
  }

  static async login(request: Request, response: Response, next: NextFunction) {
    const loginDTO = request.body as LoginDTO;
    const accountService = new AccountService();
    try {
      const user = await accountService.login(loginDTO, request.locale);
      return response.status(HttpStatus.OK).json(user);
    } catch (e) {
      next(e);
    }
  }
  

  static async verify(request: Request, response: Response, next: NextFunction) {
    const verifyDTO = request.body as VerifyDTO;
    const accountService = new AccountService();
    try {
      const user = await accountService.verify(verifyDTO, request.accountId, request.locale);
      return response.status(HttpStatus.OK).json(user);
    } catch (e) {
      next(e);
    }
  }

  static async resendVerificationCode(request: Request, response: Response, next: NextFunction) {
    const accountService = new AccountService();
    try {
      const user = await accountService.resendVerificationCode(request.accountId, request.locale);
      return response.status(HttpStatus.OK).json(user);
    } catch (e) {
      next(e);
    }
  }
}
