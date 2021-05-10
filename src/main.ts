import express from 'express';
import log from './setup/logger.setup';
import { config } from './core/factory/service/config.service';
import logger from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { onServerError, onListening, normalizePort } from './utils/helpers/_server';
import { Database } from './setup/database.setup';
import { APIFactory } from './core/factory/api/factory.api';
import { Express } from 'express';

const http = require('http');

export const app = express();

app.use(logger('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(cors());

const database = Database.connect();

const workers = database.then(async () => {
  log.debug('Workers consumed...');
  return await APIFactory.$consumeWorkers();
});

export const controllers = workers.then(() => {
  log.debug('Application routes loaded...');
  return APIFactory.configure(app);
});

export const server = controllers.then((expressApp: Express) => {
  const port = normalizePort(config.get<string>('app.port'), 3000);

  expressApp.set('port', port);

  const appServer = http.createServer(expressApp);
  appServer.listen(port);
  appServer.on('error', onServerError(port));
  appServer.on('listening', onListening(appServer));

  return appServer;
});

server.catch((err) => {
  log.error(err);
});
