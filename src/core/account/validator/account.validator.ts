import Validator from 'validatorjs';

export class AccountValidator {
  static async login(body = {}) {
    const rules = {
      username: 'required|string',
      password: 'required|min:6',
    };
    const validator = new Validator(body, rules);
    return {
      errors: validator.errors.all(),
      passed: validator.passes(),
    };
  }
}
