export const apiConfig = {
  defaultLocale: 'en',
  prefix: '^/v[1-9]',
  versions: [1],
  pagination: {
    itemsPerPage: 10,
  },
  expiresIn: 3600 * 124 * 100,
  excludedUrls: [
    { route: '', method: 'GET' },
    { route: 'login', method: 'POST' },
  ]
};
