import { add } from 'date-fns';
import { config } from '../../core/factory/service/config.service';

export class FnHelpers {
  static randomInt(start: number, end: number) {
    return Math.floor(Math.random() * (end - start) + start);
  }

  static randomFloat(start: number, end: number) {
    return Math.random() * (end - start) + start;
  }

  static clamp(
    value: number = 0,
    lowerBound: number = Number.MIN_SAFE_INTEGER,
    upperBound: number = Number.MAX_SAFE_INTEGER,
  ): number {
    return Math.min(upperBound, Math.max(lowerBound, value));
  }

  static generateVerificationCode(): number {
    return FnHelpers.randomInt(100000, 999999);
  }

  static generateVerificodeExpiration(): Date {
    const expirationDurationInMinutes = Number(config.get<string>('api.verification_code_expiration'));
    return add(new Date(), { minutes: expirationDurationInMinutes });
  }
}
