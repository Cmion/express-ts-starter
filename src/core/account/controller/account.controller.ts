import { AccountProcessor } from '../processor/account.processor';
import { ControllerFactory } from '../../factory/controller/factory.controller';
import JWTGuard from '../../../middlewares/guards/jwt.guard';

const controller = new ControllerFactory([], []);
const processor = new AccountProcessor();

controller.chain([
  ControllerFactory.create('/login', 'post', processor.login, [JWTGuard]),
  ControllerFactory.create('/test', 'get', processor.test, []),
]);

export default controller.emit();
