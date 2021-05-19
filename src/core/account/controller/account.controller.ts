import { AccountProcessor } from '../processor/account.processor';
import { AdapterFactory } from '../../factory/adapters/factory.adapter';
import ValidatorGuard from '../../../middlewares/guards/validator.guard';
import { AccountValidator } from '../validator/account.validator';
import JWTGuard from '../../../middlewares/guards/jwt.guard';

const controller = new AdapterFactory([], []);
const processor = AccountProcessor;

controller.chain(
  AdapterFactory.get('/test', processor.test, []),
  AdapterFactory.post('/login', processor.login, [ValidatorGuard(AccountValidator.login)]),
  AdapterFactory.post('/register', processor.register, [ValidatorGuard(AccountValidator.register)]),
  AdapterFactory.post('/verify-account', processor.verify, [ValidatorGuard(AccountValidator.verify), JWTGuard]),
  AdapterFactory.put('/resend-verification-code', processor.resendVerificationCode, [JWTGuard]),
);

export default controller.emit();
