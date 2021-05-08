module.exports = {
  defaultLocale: 'en',
  prefix: '^/v[1-9]',
  version: 1,
  pagination: {
    itemsPerPage: 10,
  },
  expiresIn: 3600 * 124 * 100,
  verificationCodeExpiration: 15,
  verificationRetryMax: 5,
  userRoles: ['admin', 'user'],
  excludedUrls: [
    { route: '', method: 'GET' },
    { route: 'login', method: 'POST' },
  ]
};
