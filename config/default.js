// import { apiConfig } from './api.config';
// import { appConfig } from './app.config';
// import { databaseConfig } from './database.config';
require('dotenv').config();

const apiConfig = require('./api.config');
const appConfig = require('./app.config');
const databaseConfig = require('./database.config');
const mailConfig = require('./mail.config');
const smsConfig = require('./sms.config');
const workerConfig = require('./worker.config');

const config = Object.assign(
  {},
  { api: apiConfig, database: databaseConfig, app: appConfig, mail: mailConfig, sms: smsConfig, worker: workerConfig },
);

module.exports = config;
