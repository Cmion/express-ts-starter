export class AccountValidator {
  static login = {
    email: 'required|string|email',
    password: 'required|min:6',
  };

  static register = {
    email: 'required|string|email',
    first_name: 'required|string',
    last_name: 'required|string',
    gender: `required|string|in:${["male", "female"]}`,
    password: 'required|min:6',
  };

  static verify = {
    verification_code: 'required|string|min:6|max:6'
  }
}
