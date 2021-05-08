import { ClientSession } from 'mongoose';
import { User } from '../entity/users.entity';
import { UserModel } from '../schema/users.schema';

export class UsersProcessor {
  static async register(userDetails: Partial<User>, session: ClientSession) {
    const model = UserModel;

    const user = model.findOneAndUpdate(
      { account: userDetails.account, email: userDetails.email },
      {
        $setOnInsert: {
          account: userDetails.account,
          email: userDetails.email,
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
