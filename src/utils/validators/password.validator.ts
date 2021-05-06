import { compare } from 'bcrypt';
import { isEmpty } from 'lodash';

export const validatePassword = async (
  hashedPassword: string,
  plainPassword: string,
): Promise<boolean> => {
  // console.log({ hashedPassword, plainPassword });
  if (!isEmpty(hashedPassword) && !isEmpty(plainPassword)) {
    return await compare(plainPassword, hashedPassword);
  }
  return false;
};
