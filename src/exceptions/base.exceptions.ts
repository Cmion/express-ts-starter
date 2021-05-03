import { enumerateErrorMessages } from '../utils/helpers/_error';
import { HttpError, HTTPError } from '../utils/constants/http-errors.contants';

class BaseException extends Error {
  readonly description: string;
  readonly code: number;
  readonly http_response: {
    status: number;
    message: string;
  };

  constructor(message: string | Record<string, any>, status: number, description?: string, code?: number) {
    const enumeratedMessage = enumerateErrorMessages(message);
    const httpError: HTTPError = HttpError[String(status)];

    super(enumeratedMessage);

    this.http_response = {
      status: httpError.code,
      message: httpError.message,
    };
    this.description = description;
    this.code = code ?? httpError.code;
  }

  public getStatus(): number {
    return this.http_response.status;
  }

  public getCode(): number {
    return this.code;
  }

  public getDescription(): string | undefined {
    return this.description;
  }

  public getHTTPResponse(): { status: number; message: string } {
    return this.http_response;
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
