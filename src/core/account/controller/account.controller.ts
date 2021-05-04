import { Model, Query } from 'mongoose';
import { BaseController } from '../../base/controller/base.controller';
import { AccountDocument, AccountModel } from '../schema/account.schema';
import { isFunction, pick } from 'lodash';
import config from 'config';
import jwt from 'jsonwebtoken';
import NotFoundException from '../../../exceptions/not-found.exception';
import UnauthorizedException from '../../../exceptions/unauthorized.exception';
import { validatePassword } from '../../../utils/validators/password.validator';
import locale from '../../../locale';
import SupportedLocales from '../../../enums/supported-locale.enums';
import { LoginInterface } from '../entity/login.interface';
import InternalServerErrorException from '../../../exceptions/internal-server.exception';
import { Response, Request, NextFunction } from 'express';
import BadRequestException from '../../../exceptions/bad-request.exception';
import { AccountValidator } from '../validator/account.validator';
import HttpException from '../../../exceptions/http.exceptions';
import HttpStatus from '../../../enums/http-status.enums';

export class AccountController extends BaseController<Model<AccountDocument>> {
  constructor() {
    const options = AccountModel.schema.statics['options'];
    console.log('options >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', options);
    super(AccountModel, isFunction(options) ? options() : {});
  }

  async login(request: Request, response: Response, next: NextFunction) {
    try {
      let session = await this.model.startSession();
      session.startTransaction();
      const loginDetails = request.body() as LoginInterface;

      // const appLocale = locale.get(request?.locale ?? SupportedLocales.EN);

      const validator = await AccountValidator.login(loginDetails);
      if (!validator.passed) {
        return next(new BadRequestException(validator.errors));
      }

      const auth = this.model.findOne({ email: loginDetails.email }).select('+password');

      const canLogin = await this.canLogin(auth, loginDetails);
      if (canLogin instanceof HttpException) {
        return next(canLogin);
      }

      const token = await this.signToken(auth, {});

      const data = this.toResponse({
        token,
        code: HttpStatus.OK,
        value: {
          ...(await auth.exec()).toJSON(), 
          // user: _.pick(user, ['username', 'firstName', 'lastName', 'role']),
        },
      });

      await session.commitTransaction();
      return response.status(HttpStatus.OK).json(data);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * @param {Object} auth The auth properties
   * @param {Object} user The user properties
   * @return {Promise<String>}
   */
  async signToken(auth: any, user: any) {
    const obj = {
      authId: auth._id,
      uuid: auth.publicId,
      ...pick(user, ['email']),
    };
    return jwt.sign(obj, config.get('app.serverSecret'), { expiresIn: config.get('api.expiresIn') });
  }

  /**
   * @param {Object} user The main property
   * @param {Object} object The object properties
   * @return {Object} returns the api error if main cannot be verified
   */
  async canLogin(
    accountDoc: Query<AccountDocument, AccountDocument>,
    object: Record<string, any>,
    localeISO: string | SupportedLocales = SupportedLocales.EN,
  ) {
    const account = await accountDoc.exec();

    const appLocale = locale.get(localeISO);
    if (!account) {
      return new NotFoundException(appLocale.auth.credentialIncorrect);
    }
    let authenticated = validatePassword(account.password, object.password);
    if (!authenticated) {
      return new UnauthorizedException(appLocale.auth.authenticationFailed);
    }
    return true;
  }
}
