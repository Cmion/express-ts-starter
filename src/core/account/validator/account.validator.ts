export class AccountValidator {
  static login = {
    email: 'required|string|email',
    password: 'required|min:6',
  };
}
