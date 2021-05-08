import { AccountProcessor } from '../processor/account.processor';
import { ControllerFactory } from '../../factory/controller/factory.controller';
import ValidatorGuard from '../../../middlewares/guards/validator.guard';
import { AccountValidator } from '../validator/account.validator';
import JWTGuard from '../../../middlewares/guards/jwt.guard';

const controller = new ControllerFactory([], []);
const processor = AccountProcessor;

controller.chain([
  ControllerFactory.create('/test', 'get', processor.test, []),
  ControllerFactory.create('/login', 'post', processor.login, [ValidatorGuard(AccountValidator.login)]),
  ControllerFactory.create('/register', 'post', processor.register, [ValidatorGuard(AccountValidator.register)]),
  ControllerFactory.create('/verify-account', 'post', processor.verify, [
    ValidatorGuard(AccountValidator.verify),
    JWTGuard,
  ]),
  ControllerFactory.create('/resend-verification-code', 'put', processor.resendVerificationCode, [JWTGuard]),
]);

export default controller.emit();
