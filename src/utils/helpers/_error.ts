export const enumerateErrorMessages = (message: string | Record<string, any>): string => {
  const toJSON = JSON.stringify(message);
  return toJSON;
};
