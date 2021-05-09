import express from 'express';
import log from './setup/logger.setup';
import dotenv from 'dotenv';
import config from 'config';
import logger from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { onServerError, onListening, normalizePort } from './utils/helpers/_server';
import { connect } from './setup/database.setup';
import { APIFactory } from './core/factory/api/factory.api';
import { Express } from 'express';

const http = require('http');

dotenv.config();

const app = express();

app.use(logger('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(cors());

const database = connect();

const workers = database.then(async () => {
  log.debug('Workers consumed...');
  return await APIFactory.$consumeWorkers();
});

const controllers = workers.then(() => {
  log.debug('Application routes loaded...');
  return APIFactory.configure(app);
});

const server = controllers.then((expressApp: Express) => {
  const port = normalizePort(config.get('app.port'), 3000);

  expressApp.set('port', port);

  const appServer = http.createServer(expressApp);
  appServer.listen(port);
  appServer.on('error', onServerError(port));
  appServer.on('listening', onListening(appServer));
});

server.catch((err) => {
  log.error(err);
});
