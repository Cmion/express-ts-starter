import { model } from 'mongoose';
import { AccountDocument } from '../interface/account.interface';
import AccountSchema from '../schema/account.schema';

export const AccountModel = model<AccountDocument>('accounts', AccountSchema);
