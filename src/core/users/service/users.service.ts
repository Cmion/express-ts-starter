import { ServiceFactory } from '../../factory/service/factory.service';
import { UserModel, UserModelType } from '../schema/users.schema';
import { ClientSession } from 'mongoose';
import { User } from '../entity/users.entity';

export class UsersService extends ServiceFactory<UserModelType> {
  constructor() {
    super(UserModel);
  }

  /**
   * findByAccount
   */
  public async findByAccount(account: string) {
    return this.model.findByAccount(account);
  }

  /**
   * Handles the business logic of registering a user.
   * @param userDetails 
   * @param session 
   * @returns 
   */
  public async register(userDetails: Partial<User>, session: ClientSession) {
    const user = this.model.findOneAndUpdate(
      { account: userDetails.account, email: userDetails.email },
      {
        $setOnInsert: {
          account: userDetails.account,
          email: userDetails.email,
          mobile: userDetails.mobile,
        },
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        gender: userDetails.gender,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        useFindAndModify: false,
        session: session,
      },
    );

    return user;
  }
}
