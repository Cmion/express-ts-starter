export interface AppLocale {
  auth: {
    credentialIncorrect: string;
    authenticationFailed: string;
    invalidUserAccess: string;
    inputs: string;
    expiredToken: string;
    authorizationError: string;
  };
  error: {
    server: string;
    resourceNotFound: string;
  };
  users: {
    created: string;
    updated: string;
    deleted: string;
    notFound: string;
  };
}
