import { ServiceFactory } from '../../factory/service/factory.service';
import { AccountModel, AccountModelType, AccountDocument } from '../schema/account.schema';
import { RegisterDTO } from '../dto/register.dto';
import { LoginDTO } from '../dto/login.dto';
import { Query } from 'mongoose';
import { pick } from 'lodash';
import { config } from '../../factory/service/config.service';
import jwt from 'jsonwebtoken';
import { isBefore } from 'date-fns';
import { validatePassword } from '../../../utils/validators/password.validator';
import locale from '../../../locale';
import SupportedLocales from '../../../enums/supported-locale.enum';
import Mongoose from 'mongoose';
import HttpStatus from '../../../enums/http-status.enum';
import { UsersService } from '../../users/service/users.service';
import { UserDocument } from '../../users/schema/users.schema';
import { FnHelpers } from '../../../utils/helpers/fn.helpers';
import { VerifyDTO } from '../dto/verify.dto';
import { MailFactory } from '../../factory/mail/factory.mail';
import { SMSFactory } from '../../factory/sms/factory.sms';
import {
  UnauthorizedException,
  HttpException,
  ConflictException,
  TooManyRequestsException,
  UnproccessableEntityException,
  GoneException,
  NotFoundException,
} from '../../../exceptions';

export class AccountService extends ServiceFactory<AccountModelType> {
  protected readonly usersService: UsersService;
  constructor() {
    super(AccountModel);
    this.usersService = new UsersService();
  }

  public async register(registerDTO: RegisterDTO, requestLocale: string) {
    let session = await Mongoose.startSession();

    try {
      session.startTransaction();

      const appLocale = await locale.get(requestLocale);

      const accountExists = await this.isExisting({ email: registerDTO.email });

      if (accountExists) {
        throw new ConflictException(appLocale.auth.duplicate_error);
      }

      const accountAuth = {
        verification_code: FnHelpers.generateVerificationCode().toString(),
        verification_code_expiration: FnHelpers.generateVerificodeExpiration(),
      };
      const account = (
        await this.model.create([{ ...pick(registerDTO, ['email', 'password', 'mobile']), ...accountAuth }], {
          session,
        })
      )[0];

      const user = await this.usersService.register(Object.assign({}, registerDTO, { account: account._id }), session);

      const token = await this.signToken(account, user);

      const data = await this.toResponse({
        token,
        status: HttpStatus.CREATED,
        message: appLocale.account.created,
        value: Object.assign({}, { user: user.toJSON() }, account.toJSON()),
      });

      await session.commitTransaction();

      if (config.get<string>('app.environment') !== 'test') {
        await MailFactory.useMailTrap(
          account.email,
          'Thanks for signing up with Fibonacci',
          MailFactory.HTMLVerificationTemplate(accountAuth.verification_code),
          MailFactory.TextVerificationTemplate(accountAuth.verification_code),
        );

        await SMSFactory.sendTwilioVerificationCode(registerDTO.mobile, accountAuth.verification_code);
      }

      return data;
    } catch (e) {
      if (session) {
        await session.abortTransaction();
      }
      throw e;
    }
  }

  public async login(loginDTO: LoginDTO, requestLocale: string) {
    try {
      const account = this.model.findOne({ email: loginDTO.email }).select('+password');

      const canLogin = await this.canLogin(account, loginDTO, requestLocale);
      if (canLogin instanceof HttpException) {
        throw canLogin;
      }

      const user = await this.usersService.findByAccount((await account.exec())._id);

      const token = await this.signToken(await account.exec(), user);

      const data = await this.toResponse({
        token,
        status: HttpStatus.OK,
        value: {
          ...(await account.exec()).toJSON(),
          user,
        },
      });

      return data;
    } catch (e) {
      throw e;
    }
  }

  /**
   * verify
   */
  public async verify(verifyDTO: VerifyDTO, accountId: string, localeISO: string) {
    let account = this.model.findById(accountId);

    const appLocale = await locale.get(localeISO);

    const accountObject = await account.exec();

    if (accountObject.is_verified) {
      throw new ConflictException(appLocale.auth.account_verified);
    }

    const retryMax = Number(config.get('api.verification_retry_max'));

    const verificationRetryReached = accountObject.verification_code_retry_count >= retryMax;

    if (verificationRetryReached) {
      throw new TooManyRequestsException(appLocale.auth.verification_code_retry_reached);
    }

    const codeExpired = isBefore(new Date(accountObject.verification_code_expiration), new Date());

    const isValidCode = accountObject.verification_code === verifyDTO.verification_code;

    if (isValidCode && codeExpired) {
      throw new GoneException(appLocale.auth.verification_code_expired);
    }

    if (!isValidCode) {
      //@ts-ignore
      this.model.findByIdAndUpdate(accountId, {
        $set: {
          verification_code_retry_count: accountObject.verification_code_retry_count + 1,
        },
      });
      throw new UnproccessableEntityException(appLocale.auth.invalid_verification_code);
    }

    account = this.model.findByIdAndUpdate(
      accountId,
      {
        $set: {
          verification_code: null,
          verification_code_retry_count: 0,
          is_verified: true,
          verification_code_expiration: null,
        },
      },
      { new: true },
    );

    const user = await this.usersService.findByAccount(accountId);

    const data = await this.toResponse({
      status: HttpStatus.OK,
      message: appLocale.auth.verification_successful,
      value: {
        ...(await account.exec()).toJSON(),
        user,
      },
    });

    return data;
  }

  /**
   * resendVerificationCode
   */
  public async resendVerificationCode(accountId: string, localeISO: string) {
    let account = this.model.findById(accountId);
    const appLocale = await locale.get(localeISO);

    const accountObject = await account.exec();
    if (accountObject.is_verified) {
      throw new ConflictException(appLocale.auth.account_verified);
    }

    const accountAuth = {
      verification_code: FnHelpers.generateVerificationCode().toString(),
      verification_code_expiration: FnHelpers.generateVerificodeExpiration(),
      verification_code_retry_count: 0,
    };

    const updatedAccount = await this.model.findByIdAndUpdate(accountId, { $set: accountAuth }, { new: true });

    if (config.get<string>('app.environment') !== 'test') {
      await MailFactory.useMailTrap(
        accountObject.email,
        'Thanks for signing up with Fibonacci',
        MailFactory.HTMLVerificationTemplate(accountAuth.verification_code),
        'Hello World',
      );

      await SMSFactory.sendTwilioVerificationCode(updatedAccount.mobile, accountAuth.verification_code);
    }
    return await this.toResponse({
      status: HttpStatus.OK,
      message: appLocale.auth.verification_code_resend,
    });
  }

  /**
   * @param {Object} account The account properties
   * @param {Object} user The user properties
   * @return {Promise<String>}
   */
  protected async signToken(account: AccountDocument, user: UserDocument) {
    const obj = {
      accountId: account._id,
      ...pick(user, ['email']),
    };
    return jwt.sign(obj, config.get<string>('app.secrets.server_secret'), {
      expiresIn: config.get<number>('api.expires_in'),
    });
  }

  /**
   * @param {Object} user The main property
   * @param {Object} object The object properties
   * @return {Object} returns the api error if main cannot be verified
   */
  protected async canLogin(
    accountDoc: Query<AccountDocument, AccountDocument>,
    object: Record<string, any>,
    localeISO: string = SupportedLocales.EN,
  ) {
    const account = await accountDoc.exec();

    const appLocale = await locale.get(localeISO);
    if (!account) {
      return new NotFoundException(appLocale.auth.account_does_not_exist);
    }
    // if (!account.is_verified) {
    //   throw new UnauthorizedException(appLocale.auth.account_not_verified);
    // }
    const authenticated = await validatePassword(account.password, object.password);

    if (!authenticated) {
      return new UnauthorizedException(appLocale.auth.authentication_failed);
    }
    return true;
  }
}
