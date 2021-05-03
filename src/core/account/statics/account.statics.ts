import { AccountDocument, AccountModel } from '../interface/account.interface';

export async function findByEmail(this: AccountModel, email: string): Promise<AccountDocument[]> {
  return this.find({ email });
}
