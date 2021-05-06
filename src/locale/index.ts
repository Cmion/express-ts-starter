import config from 'config';
import SupportedLocales from '../enums/supported-locale.enums';
import { AppLocale } from '../interfaces/locales.interface';
import enLocale from './en.locale.json';
import { SupportedLocalesArray } from '../utils/constants/locale.contant';

const defaultLocale = config.get<SupportedLocales>('api.defaultLocale') ?? SupportedLocales.EN;

const get = async (locale: string = defaultLocale): Promise<AppLocale> => {
  if (SupportedLocalesArray.includes(locale)) {
    try {
      return await import(`./${locale ?? SupportedLocales.EN}.locale.json`);
    } catch {
      return enLocale;
    }
  }
  return enLocale;
};

export default { get };
