export class AccountValidator {
  static login = {
    email: 'required|string|email',
    password: 'required|string|min:6',
  };

  static register = {
    email: 'required|string|email',
    first_name: 'required|string',
    last_name: 'required|string',
    gender: `required|string|in:${['male', 'female']}`,
    password: 'required|string|min:6',
    mobile: 'required|string',
  };

  static verify = {
    verification_code: 'required|string|min:6|max:6',
  };

  static changePassword = {
    current_password: 'required|string|min:6',
    new_password: 'required|string|min:6'
  };
}
