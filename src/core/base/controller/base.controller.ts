import account from '../../account/controller/account.controller';
import { ControllerFactory } from '../../factory/controller/factory.controller';

const baseController = new ControllerFactory().emit();

baseController.use(account);

export default baseController