import { Response, Request, NextFunction } from 'express';
import SupportedLocales from '../../enums/supported-locale.enum';
import { SupportedLocalesArray } from '../../utils/constants/locale.contant';

const LocaleGuard = (request: Request, response: Response, next: NextFunction) => {
  // check header or url parameters or post parameters for locale
  let locale = (request.query.api_locale || request.headers['x-api-locale']) as string;
  if (locale) {
    const isValidLocale = SupportedLocalesArray.includes(locale);
    if (!isValidLocale) {
      request.locale = SupportedLocales.EN;
    }
    request.locale = locale;
  } else {
    request.locale = SupportedLocales.EN;
  }

  return next();
};

export default LocaleGuard;
