const PORT = process.env.PORT || 3000;

module.exports= {
  appName: process.env.APP_NAME || 'App Name',
  environment: process.env.NODE_ENV || 'dev',
  baseUrl: `http://localhost:${PORT}`,
  port: PORT,
  secrets: {
    serverSecret: process.env.SERVER_SECRET || 'ipa-BUhBOJAm',
  }
};
