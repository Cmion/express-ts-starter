import * as Mongoose from 'mongoose';
import config from 'config';
import logger from './logger.setup'
// import { UserModel } from './users/users.model';

export const connect = () => {

  let uri = config.get<string>('database.uri');

  if (config.get('app.environment') === 'test') {
    uri = config.get<string>('database.testURI');
  }

  if (Mongoose.connection) {
    return;
  }

  Mongoose.connection.once('open', async () => {
    logger.debug('Connected to database');
  });

  Mongoose.connection.on('error', () => {
    logger.error('Error connecting to database');
  });

  Mongoose.connection.on('disconnected', () => {
    logger.debug('Mongoose connection to mongodb shell disconnected');
  }) 

  const connector = Mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });  

  return connector;
};
