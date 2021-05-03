import { apiConfig } from './api.config';
import { appConfig } from './app.config';
import { databaseConfig } from './database.config';

const config = Object.assign({}, { api: apiConfig, database: databaseConfig, app: appConfig });

export default config;
