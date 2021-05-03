import express from 'express';
import { connect } from './setup/database.setup';
import log from './setup/logger.setup';
import { onServerError, onListening, normalizePort } from './utils/helpers/_server';
import dotenv from 'dotenv';
import config from 'config';
import logger from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const http = require('http');

dotenv.config();

const app = express();

app.use(logger('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(cors());

const database = connect();

const controllers = database.then(() => {});

const server = controllers.then(() => {
  const port = normalizePort(config.get('app.port'), 3000);
  
  app.set('port', port);

  const appServer = http.createServer(app);
  appServer.listen(port);
  appServer.on('error', onServerError(port));
  appServer.on('listening', onListening(appServer));

});

server.catch((err) => {
  log.error(err);
});