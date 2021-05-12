import { config } from '../core/factory/service/config.service';
import SupportedLocales from '../enums/supported-locale.enum';
import { AppLocale } from '../interfaces/locales.interface';
import enLocale from './en.locale.json';
import { SupportedLocalesArray } from '../utils/constants/locale.contant';

const defaultLocale = config.get<string>('api.default_locale');

export const get = async (locale: string = defaultLocale): Promise<AppLocale> => {
  if (SupportedLocalesArray.includes(locale)) {
    try {
      return await import(`./${locale ?? SupportedLocales.EN}.locale.json`);
    } catch {
      return enLocale;
    }
  }
  return enLocale;
};

export const getSync = (locale: string = defaultLocale): AppLocale => {
  const enLocale = require('./en.locale.json');
  if (SupportedLocalesArray.includes(locale)) {
    try {
      return require(`./${locale ?? SupportedLocales.EN}.locale.json`);
    } catch {
      return enLocale;
    }
  }
  return enLocale;
};

export default { get, getSync };
