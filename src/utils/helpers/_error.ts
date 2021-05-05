import { isString } from 'lodash';

export const enumerateErrorMessages = (message: string | Record<string, any>): string => {
  if (isString(message)) return message;

  const toJSON = JSON.stringify(message);
  return toJSON;
};
