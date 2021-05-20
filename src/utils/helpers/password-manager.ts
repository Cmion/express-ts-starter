import { hashSync, compare, compareSync } from 'bcrypt';
import { isEmpty } from 'lodash';

export class PasswordManager {
  /**
   * Generates the hash of a password
   * @param password
   * @returns
   */
  static async hash(password: string) {
    return hashSync(password, 10);
  }

  /**
   * Validates a plain password, by comparing it with the hash.
   * @param hashedPassword
   * @param plainPassword
   * @returns
   */
  static async validate(hashedPassword: string, plainPassword: string): Promise<boolean> {
    // console.log({ hashedPassword, plainPassword });
    if (!isEmpty(hashedPassword) && !isEmpty(plainPassword)) {
      return await compare(plainPassword, hashedPassword);
    }
    return false;
  }

  /**
   * Validates a plain password, by comparing it with the hash synchronously
   * @param hashedPassword
   * @param plainPassword
   * @returns
   */
  static validateSync(hashedPassword: string, plainPassword: string): boolean {
    // console.log({ hashedPassword, plainPassword });
    if (!isEmpty(hashedPassword) && !isEmpty(plainPassword)) {
      return compareSync(plainPassword, hashedPassword);
    }
    return false;
  }

  /**
   * Checks a provided password exists in a password log
   * @param log
   * @param comparedPassword
   * @returns
   */
  static findInLog(log: { password: string; log_date: Date }[], comparedPassword: string) {
    const value = log.find((predicate) => PasswordManager.validateSync(predicate.password, comparedPassword));
    return value;
  }
}
