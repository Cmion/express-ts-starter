import Mongoose, { Query } from 'mongoose';
import { ProcessorFactory } from '../../factory/processor/factory.processor';
import { AccountDocument, AccountModel, AccountModelType } from '../schema/account.schema';
import { pick } from 'lodash';
import config from 'config';
import jwt from 'jsonwebtoken';
import UnauthorizedException from '../../../exceptions/unauthorized.exception';
import { validatePassword } from '../../../utils/validators/password.validator';
import locale from '../../../locale';
import SupportedLocales from '../../../enums/supported-locale.enums';
import { LoginInterface } from '../entity/login.interface';
import { Response, Request, NextFunction } from 'express';
import HttpException from '../../../exceptions/http.exceptions';
import HttpStatus from '../../../enums/http-status.enums';

export class AccountProcessor {
  static async test(request: Request, response: Response, next: NextFunction) {
    return response.status(HttpStatus.OK).json({ data: 'testing' });
  }

  static async login(request: Request, response: Response, next: NextFunction) {
    let session;
    const model = AccountModel;

    const processorFactory = new ProcessorFactory<AccountModelType>(model);

    try {
      session = await Mongoose.startSession();
      session.startTransaction();

      const loginDetails = request.body as LoginInterface;

      const auth = model.findOne({ email: loginDetails.email }).select('+password');

      const canLogin = await AccountProcessor.canLogin(auth, loginDetails);
      if (canLogin instanceof HttpException) {
        return next(canLogin);
      }

      const token = await AccountProcessor.signToken(auth, {});

      const data = processorFactory.toResponse({
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
      if (session) {
        await session.abortTransaction();
      }
      return next(e);
    }
  }

  /**
   * @param {Object} auth The auth properties
   * @param {Object} user The user properties
   * @return {Promise<String>}
   */
  protected static async signToken(auth: any, user: any) {
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
  protected static async canLogin(
    accountDoc: Query<AccountDocument, AccountDocument>,
    object: Record<string, any>,
    localeISO: string = SupportedLocales.EN,
  ) {
    const account = await accountDoc.exec();

    const appLocale = await locale.get(localeISO);
    if (!account) {
      return new UnauthorizedException(appLocale.auth.credentialIncorrect);
    }
    let authenticated = validatePassword(account.password, object.password);
    if (!authenticated) {
      return new UnauthorizedException(appLocale.auth.authenticationFailed);
    }
    return true;
  }
}
