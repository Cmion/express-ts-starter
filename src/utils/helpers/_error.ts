import { flatten, isString } from 'lodash';

export const enumerateErrorMessages = (message: string | Record<string, any>): string => {
  if (isString(message)) return message;

  return JSON.stringify(flatten(Object.values(message)));
};
