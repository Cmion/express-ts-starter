import config from 'config';
import SupportedLocales from '../enums/supported-locale.enums';
import { get, has } from 'lodash';
import { AppLocale } from '../interfaces/locales.interface';
const enLocale = require('./en.locale.json');

const defaultLocale = config.get<SupportedLocales>('api.defaultLocale') ?? SupportedLocales.EN;

const localeGetter = (localeName: SupportedLocales | string = defaultLocale): AppLocale => {
  if (has(SupportedLocales, localeName)) {
    try {
      const locale = JSON.parse(require(`${get(SupportedLocales, localeName, 'EN')}.locale.json`));
      return locale;
    } catch {
      return JSON.parse(enLocale);
    }
  }
  return JSON.parse(enLocale);
};

export default { get: localeGetter };
