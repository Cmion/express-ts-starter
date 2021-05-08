export interface HTTPError {
  code: number;
  message: string;
}
export const HttpError: Record<string, HTTPError> = {
  '300': {
    code: 300,
    message:
      'The requested resource corresponds to any one of a set of representations, each with its own specific location.',
  },
  '301': {
    code: 301,
    message: 'The resource has moved permanently. Please refer to the documentation.',
  },
  '302': {
    code: 302,
    message: 'The resource has moved temporarily. Please refer to the documentation.',
  },
  '303': {
    code: 303,
    message: 'The resource can be found under a different URI.',
  },
  '304': { code: 304, message: 'The resource is available and not modified.' },
  '305': {
    code: 305,
    message: 'The requested resource must be accessed through the proxy given by the Location field.',
  },
  '307': {
    code: 307,
    message: 'The resource resides temporarily under a different URI.',
  },
  '400': {
    code: 400,
    message: 'Invalid syntax for this request was provided.',
  },
  '401': {
    code: 401,
    message: 'You are unauthorized to access the requested resource.',
  },
  '403': {
    code: 403,
    message: 'Your account is not authorized to access the requested resource.',
  },
  '404': {
    code: 404,
    message:
      'We could not find the resource you requested. Please refer to the documentation for the list of resources.',
  },
  '405': {
    code: 405,
    message: 'This method type is not currently supported.',
  },
  '406': {
    code: 406,
    message: 'Acceptance header is invalid for this endpoint resource.',
  },
  '407': { code: 407, message: 'Authentication with proxy is required.' },
  '408': {
    code: 408,
    message: 'Client did not produce a request within the time that the server was prepared to wait.',
  },
  '409': {
    code: 409,
    message: 'The request could not be completed due to a conflict with the current state of the resource.',
  },
  '410': {
    code: 410,
    message: 'The requested resource is no longer available and has been permanently removed.',
  },
  '411': {
    code: 411,
    message: 'Length of the content is required, please include it with the request.',
  },
  '412': {
    code: 412,
    message: 'The request did not match the pre-conditions of the requested resource.',
  },
  '413': {
    code: 413,
    message: 'The request entity is larger than the server is willing or able to process.',
  },
  '414': {
    code: 414,
    message: 'The request URI is longer than the server is willing to interpret.',
  },
  '415': {
    code: 415,
    message: 'The requested resource does not support the media type provided.',
  },
  '416': {
    code: 416,
    message: 'The requested range for the resource is not available.',
  },
  '417': {
    code: 417,
    message: 'Unable to meet the expectation given in the Expect request header.',
  },
  '419': {
    code: 419,
    message: 'The requested resource is missing required arguments.',
  },
  '420': {
    code: 420,
    message: 'The requested resource does not support one or more of the given parameters.',
  },
  '422': {
    code: 422,
    message: 'The request was well-formed but was unable to be followed due to semantic errors.',
  },
  '429': {
    code: 429,
    message: 'Too many requests',
  },
  '500': { code: 500, message: 'Unexpected internal server error.' },
  '501': {
    code: 501,
    message: 'The requested resource is recognized but not implemented.',
  },
  '502': {
    code: 502,
    message: 'Invalid response received when acting as a proxy or gateway.',
  },
  '503': { code: 503, message: 'The server is currently unavailable.' },
  '504': {
    code: 504,
    message: 'Did not receive a timely response from upstream server while acting as a gateway or proxy.',
  },
  '505': {
    code: 505,
    message: 'The HTTP protocol version used in the request message is not supported.',
  },
  '550': {
    code: 550,
    message: 'A failure occurred during initialization of services. API will be unavailable.',
  },
  MULTIPLE_CHOICES: {
    code: 300,
    message:
      'The requested resource corresponds to any one of a set of representations, each with its own specific location.',
  },
  MOVED_PERMANENTLY: {
    code: 301,
    message: 'The resource has moved permanently. Please refer to the documentation.',
  },
  FOUND: {
    code: 302,
    message: 'The resource has moved temporarily. Please refer to the documentation.',
  },
  SEE_OTHER: {
    code: 303,
    message: 'The resource can be found under a different URI.',
  },
  NOT_MODIFIED: { code: 304, message: 'The resource is available and not modified.' },
  USE_PROXY: {
    code: 305,
    message: 'The requested resource must be accessed through the proxy given by the Location field.',
  },
  TEMPORARY_REDIRECT: {
    code: 307,
    message: 'The resource resides temporarily under a different URI.',
  },
  BAD_REQUEST: {
    code: 400,
    message: 'Invalid syntax for this request was provided.',
  },
  UNAUTHORIZED: {
    code: 401,
    message: 'You are unauthorized to access the requested resource.',
  },
  FORBIDDEN: {
    code: 403,
    message: 'Your account is not authorized to access the requested resource.',
  },
  NOT_FOUND: {
    code: 404,
    message:
      'We could not find the resource you requested. Please refer to the documentation for the list of resources.',
  },
  METHOD_NOT_ALLOWED: {
    code: 405,
    message: 'This method type is not currently supported.',
  },
  NOT_ACCEPTABLE: {
    code: 406,
    message: 'Acceptance header is invalid for this endpoint resource.',
  },
  PROXY_AUTHENTICATION_REQUIRED: { code: 407, message: 'Authentication with proxy is required.' },
  REQUEST_TIMEOUT: {
    code: 408,
    message: 'Client did not produce a request within the time that the server was prepared to wait.',
  },
  CONFLICT: {
    code: 409,
    message: 'The request could not be completed due to a conflict with the current state of the resource.',
  },
  GONE: {
    code: 410,
    message: 'The requested resource is no longer available and has been permanently removed.',
  },
  LENGTH_REQUIRED: {
    code: 411,
    message: 'Length of the content is required, please include it with the request.',
  },
  PRECONDITION_FAILED: {
    code: 412,
    message: 'The request did not match the pre-conditions of the requested resource.',
  },
  REQUEST_ENTITY_TOO_LARGE: {
    code: 413,
    message: 'The request entity is larger than the server is willing or able to process.',
  },
  'REQUEST-URI_TOO_LONG': {
    code: 414,
    message: 'The request URI is longer than the server is willing to interpret.',
  },
  UNSUPPORTED_MEDIA_TYPE: {
    code: 415,
    message: 'The requested resource does not support the media type provided.',
  },
  REQUESTED_RANGE_NOT_SATISFIABLE: {
    code: 416,
    message: 'The requested range for the resource is not available.',
  },
  EXPECTATION_FAILED: {
    code: 417,
    message: 'Unable to meet the expectation given in the Expect request header.',
  },
  MISSING_ARGUMENTS: {
    code: 419,
    message: 'The requested resource is missing required arguments.',
  },
  INVALID_ARGUMENTS: {
    code: 420,
    message: 'The requested resource does not support one or more of the given parameters.',
  },
  UNPROCESSABLE_ENTITY: {
    code: 422,
    message: 'The request was well-formed but was unable to be followed due to semantic errors.',
  },
  INTERNAL_SERVER_ERROR: { code: 500, message: 'Unexpected internal server error.' },
  NOT_IMPLEMENTED: {
    code: 501,
    message: 'The requested resource is recognized but not implemented.',
  },
  BAD_GATEWAY: {
    code: 502,
    message: 'Invalid response received when acting as a proxy or gateway.',
  },
  SERVICE_UNAVAILABLE: { code: 503, message: 'The server is currently unavailable.' },
  GATEWAY_TIMEOUT: {
    code: 504,
    message: 'Did not receive a timely response from upstream server while acting as a gateway or proxy.',
  },
  HTTP_VERSION_NOT_SUPPORTED: {
    code: 505,
    message: 'The HTTP protocol version used in the request message is not supported.',
  },
  INITIALIZATION_FAILURE: {
    code: 550,
    message: 'A failure occurred during initialization of services. API will be unavailable.',
  },
  TOO_MANY_REQUESTS: {
    code: 429,
    message: 'Too many requests',
  },
};
