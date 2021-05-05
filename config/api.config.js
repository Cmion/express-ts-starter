module.exports = {
  defaultLocale: 'EN',
  prefix: '^/v[1-9]',
  version: 1,
  pagination: {
    itemsPerPage: 10,
  },
  expiresIn: 3600 * 124 * 100,
  excludedUrls: [
    { route: '', method: 'GET' },
    { route: 'login', method: 'POST' },
  ]
};
