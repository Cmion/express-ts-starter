import account from '../../../api/account/controller/account.controller';
import { AdapterFactory } from '../../factory/adapters/factory.adapter';

const baseController = new AdapterFactory().emit();

baseController.use(account);

export default baseController