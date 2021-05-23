import { User } from '../../users/entity/users.entity';

export interface RegisterDTO extends Partial<User> {
  password: string;
  email: string;
}
