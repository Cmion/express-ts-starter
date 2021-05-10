import Mongoose from 'mongoose';
import { config } from '../core/factory/service/config.service';
import logger from './logger.setup';
// import { UserModel } from './users/users.model';

export class Database {
  static connect(): Promise<typeof Mongoose> {
    let uri = config.get<string>('database.uri');

    if (config.get<string>('app.environment') === 'test') {
      uri = config.get<string>('database.test_uri');
    }

    const connector = Mongoose.connect(uri, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    Mongoose.connection.once('open', async () => {
      logger.debug('Connected to database');
    });

    Mongoose.connection.on('error', () => {
      logger.error('Error connecting to database');
    });

    Mongoose.connection.on('disconnected', () => {
      logger.debug('Mongoose connection to mongodb shell disconnected');
    });

    return connector;
  }
}
