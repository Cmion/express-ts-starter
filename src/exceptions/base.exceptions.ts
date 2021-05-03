import { enumerateErrorMessages } from '../utils/helpers/_error';

class BaseException extends Error {
  private readonly code: number;

  constructor(message: string | Record<string, any>, code: number) {
    const enumeratedMessage = enumerateErrorMessages(message);

    super(enumeratedMessage);

    this.code = code;
  }

  public getStatus(): number {
    return this.code;
  }

  public getResponse(): string | Record<string, any> {
    try {
      const message = JSON.parse(this.message);
      return message;
    } catch (e) {
      return this.message;
    }
  }
}

export default BaseException;
