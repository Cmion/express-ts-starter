export interface HTTPResponse {
  status: number;
  message: string;
}

// Note: Some response not regarded as useful is not included in this enumeration.
export const HttpResponse = Object.freeze({
  '200': {
    status: 200,
    message: 'The request was successful',
  },
  '201': {
    status: 201,
    message: 'The request has succeeded and a new resource has been created as a result',
  },
  '202': {
    status: 202,
    message: 'The request has been received but not yet acted upon',
  },

  '204': {
    status: 204,
    message: 'There is no content to send for this request',
  },
  '300': {
    status: 300,
    message:
      'The requested resource corresponds to any one of a set of representations, each with its own specific location.',
  },
  '301': {
    status: 301,
    message: 'The resource has moved permanently. Please refer to the documentation.',
  },
  '302': {
    status: 302,
    message: 'The resource has moved temporarily. Please refer to the documentation.',
  },
  '303': {
    status: 303,
    message: 'The resource can be found under a different URI.',
  },
  '304': { status: 304, message: 'The resource is available and not modified.' },
  '305': {
    status: 305,
    message: 'The requested resource must be accessed through the proxy given by the Location field.',
  },
  '307': {
    status: 307,
    message: 'The resource resides temporarily under a different URI.',
  },
  '400': {
    status: 400,
    message: 'Invalid syntax for this request was provided.',
  },
  '401': {
    status: 401,
    message: 'You are unauthorized to access the requested resource.',
  },
  '403': {
    status: 403,
    message: 'Your account is not authorized to access the requested resource.',
  },
  '404': {
    status: 404,
    message:
      'We could not find the resource you requested. Please refer to the documentation for the list of resources.',
  },
  '405': {
    status: 405,
    message: 'This method type is not currently supported.',
  },
  '406': {
    status: 406,
    message: 'Acceptance header is invalid for this endpoint resource.',
  },
  '407': { status: 407, message: 'Authentication with proxy is required.' },
  '408': {
    status: 408,
    message: 'Client did not produce a request within the time that the server was prepared to wait.',
  },
  '409': {
    status: 409,
    message: 'The request could not be completed due to a conflict with the current state of the resource.',
  },
  '410': {
    status: 410,
    message: 'The requested resource is no longer available and has been permanently removed.',
  },
  '411': {
    status: 411,
    message: 'Length of the content is required, please include it with the request.',
  },
  '412': {
    status: 412,
    message: 'The request did not match the pre-conditions of the requested resource.',
  },
  '413': {
    status: 413,
    message: 'The request entity is larger than the server is willing or able to process.',
  },
  '414': {
    status: 414,
    message: 'The request URI is longer than the server is willing to interpret.',
  },
  '415': {
    status: 415,
    message: 'The requested resource does not support the media type provided.',
  },
  '416': {
    status: 416,
    message: 'The requested range for the resource is not available.',
  },
  '417': {
    status: 417,
    message: 'Unable to meet the expectation given in the Expect request header.',
  },
  '419': {
    status: 419,
    message: 'The requested resource is missing required arguments.',
  },
  '420': {
    status: 420,
    message: 'The requested resource does not support one or more of the given parameters.',
  },
  '422': {
    status: 422,
    message: 'The request was well-formed but was unable to be followed due to semantic errors.',
  },
  '429': {
    status: 429,
    message: 'Too many requests',
  },
  '500': { status: 500, message: 'Unexpected internal server error.' },
  '501': {
    status: 501,
    message: 'The requested resource is recognized but not implemented.',
  },
  '502': {
    status: 502,
    message: 'Invalid response received when acting as a proxy or gateway.',
  },
  '503': { status: 503, message: 'The server is currently unavailable.' },
  '504': {
    status: 504,
    message: 'Did not receive a timely response from upstream server while acting as a gateway or proxy.',
  },
  '505': {
    status: 505,
    message: 'The HTTP protocol version used in the request message is not supported.',
  },
  '550': {
    status: 550,
    message: 'A failure occurred during initialization of services. API will be unavailable.',
  },
  MULTIPLE_CHOICES: {
    status: 300,
    message:
      'The requested resource corresponds to any one of a set of representations, each with its own specific location.',
  },
  MOVED_PERMANENTLY: {
    status: 301,
    message: 'The resource has moved permanently. Please refer to the documentation.',
  },
  FOUND: {
    status: 302,
    message: 'The resource has moved temporarily. Please refer to the documentation.',
  },
  SEE_OTHER: {
    status: 303,
    message: 'The resource can be found under a different URI.',
  },
  NOT_MODIFIED: { status: 304, message: 'The resource is available and not modified.' },
  USE_PROXY: {
    status: 305,
    message: 'The requested resource must be accessed through the proxy given by the Location field.',
  },
  TEMPORARY_REDIRECT: {
    status: 307,
    message: 'The resource resides temporarily under a different URI.',
  },
  BAD_REQUEST: {
    status: 400,
    message: 'Invalid syntax for this request was provided.',
  },
  UNAUTHORIZED: {
    status: 401,
    message: 'You are unauthorized to access the requested resource.',
  },
  FORBIDDEN: {
    status: 403,
    message: 'Your account is not authorized to access the requested resource.',
  },
  NOT_FOUND: {
    status: 404,
    message:
      'We could not find the resource you requested. Please refer to the documentation for the list of resources.',
  },
  METHOD_NOT_ALLOWED: {
    status: 405,
    message: 'This method type is not currently supported.',
  },
  NOT_ACCEPTABLE: {
    status: 406,
    message: 'Acceptance header is invalid for this endpoint resource.',
  },
  PROXY_AUTHENTICATION_REQUIRED: { status: 407, message: 'Authentication with proxy is required.' },
  REQUEST_TIMEOUT: {
    status: 408,
    message: 'Client did not produce a request within the time that the server was prepared to wait.',
  },
  CONFLICT: {
    status: 409,
    message: 'The request could not be completed due to a conflict with the current state of the resource.',
  },
  GONE: {
    status: 410,
    message: 'The requested resource is no longer available and has been permanently removed.',
  },
  LENGTH_REQUIRED: {
    status: 411,
    message: 'Length of the content is required, please include it with the request.',
  },
  PRECONDITION_FAILED: {
    status: 412,
    message: 'The request did not match the pre-conditions of the requested resource.',
  },
  REQUEST_ENTITY_TOO_LARGE: {
    status: 413,
    message: 'The request entity is larger than the server is willing or able to process.',
  },
  REQUEST_URI_TOO_LONG: {
    status: 414,
    message: 'The request URI is longer than the server is willing to interpret.',
  },
  UNSUPPORTED_MEDIA_TYPE: {
    status: 415,
    message: 'The requested resource does not support the media type provided.',
  },
  REQUESTED_RANGE_NOT_SATISFIABLE: {
    status: 416,
    message: 'The requested range for the resource is not available.',
  },
  EXPECTATION_FAILED: {
    status: 417,
    message: 'Unable to meet the expectation given in the Expect request header.',
  },
  MISSING_ARGUMENTS: {
    status: 419,
    message: 'The requested resource is missing required arguments.',
  },
  INVALID_ARGUMENTS: {
    status: 420,
    message: 'The requested resource does not support one or more of the given parameters.',
  },
  UNPROCESSABLE_ENTITY: {
    status: 422,
    message: 'The request was well-formed but was unable to be followed due to semantic errors.',
  },
  INTERNAL_SERVER_ERROR: { status: 500, message: 'Unexpected internal server error.' },
  NOT_IMPLEMENTED: {
    status: 501,
    message: 'The requested resource is recognized but not implemented.',
  },
  BAD_GATEWAY: {
    status: 502,
    message: 'Invalid response received when acting as a proxy or gateway.',
  },
  SERVICE_UNAVAILABLE: { status: 503, message: 'The server is currently unavailable.' },
  GATEWAY_TIMEOUT: {
    status: 504,
    message: 'Did not receive a timely response from upstream server while acting as a gateway or proxy.',
  },
  HTTP_VERSION_NOT_SUPPORTED: {
    status: 505,
    message: 'The HTTP protocol version used in the request message is not supported.',
  },
  INITIALIZATION_FAILURE: {
    status: 550,
    message: 'A failure occurred during initialization of services. API will be unavailable.',
  },
  TOO_MANY_REQUESTS: {
    status: 429,
    message: 'Too many requests',
  },
  OK: {
    status: 200,
    message: 'The request was successful',
  },
  CREATED: {
    status: 201,
    message: 'The request has succeeded and a new resource has been created as a result',
  },
  ACCEPTED: {
    status: 202,
    message: 'The request has been received but not yet acted upon',
  },

  NO_CONTENT: {
    status: 204,
    message: 'There is no content to send for this request',
  },
});
