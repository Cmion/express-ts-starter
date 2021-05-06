import { AccountProcessor } from '../processor/account.processor';
import { ControllerFactory } from '../../factory/controller/factory.controller';
import ValidatorGuard from '../../../middlewares/guards/validator.guard';
import { AccountValidator } from '../validator/account.validator';

const controller = new ControllerFactory([], []);
const processor = AccountProcessor;

controller.chain([
  ControllerFactory.create('/test', 'get', processor.test, []),
  ControllerFactory.create('/login', 'post', processor.login, [ValidatorGuard(AccountValidator.login)]),
]);

export default controller.emit();
