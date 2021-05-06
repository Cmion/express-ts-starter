import { enumerateErrorMessages } from '../utils/helpers/_error';
import { HttpError, HTTPError } from '../utils/constants/http-errors.contants';
import { isObject } from 'lodash';

class HttpException extends Error {
  readonly description: string;
  readonly code: number;
  readonly details: Record<string, any>;
  readonly http_response: {
    status: number;
    message: string;
  };

  /**
   * Base HTTP Exception class
   * @param message Http error message
   * @param status Http status code
   * @param description Error description
   * @param code Error code [default to HTTP Status Codes]
   */
  constructor(message: string | Record<string, any>, status: number, description?: string, code?: number) {
    const httpError: HTTPError = HttpError[String(status)];

    const enumeratedMessage = enumerateErrorMessages(message);
    super(enumeratedMessage);

    if (isObject(message)) {
      this.details = message;
    }

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

export default HttpException;
