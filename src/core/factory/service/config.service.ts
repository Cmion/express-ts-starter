import fs from 'fs';
import dotenv from 'dotenv';
import { isPlainObject, isString, get as lodashGet, has as lodashHas } from 'lodash';

dotenv.config();

export class Config {
  protected configuration: Record<string, any>;
  protected NODE_ENV = process.env.NODE_ENV;
  protected CWD = process.cwd();

  get<
    T extends
      | string
      | number
      | boolean
      | undefined
      | Record<string, any>
      | string[]
      | number[]
      | boolean[]
      | Record<string, any>[]
  >(path: string): T {
    return lodashGet<any, string>(this.configuration, path) as T;
  }

  has(path: string): boolean {
    return lodashHas(this.configuration, path);
  }

  public async loadAsync() {
    let configs = {};
    try {
      configs = Object.assign({}, configs, await Config.getFileAsync(this.CWD + '/src/config/default.json'));
    } catch (e) {
      if (e instanceof SyntaxError && e.message === 'Unexpected end of JSON input') {
        throw new Error('Invalid `default.json` was provided');
      }
      throw new Error(Config.evaluateConfigError(e, 'Could not find default.json configuration file'));
    }

    try {
      configs = Object.assign(
        {},
        configs,
        await Config.getFileAsync(this.CWD + `/src/config/env/${this.NODE_ENV}.json`),
      );
    } catch (e) {
      if (e instanceof SyntaxError && e.message === 'Unexpected end of JSON input') {
        throw new Error(`Invalid ${this.NODE_ENV}.json was provided`);
      }
      throw new Error(Config.evaluateConfigError(e, 'Could not find environment configuration file'));
    }

    return configs;
  }

  public load() {
    try {
      this.configuration = Object.assign({}, this.configuration, Config.getFile(this.CWD + '/src/config/default.json'));
    } catch (e) {
      if (e instanceof SyntaxError && e.message === 'Unexpected end of JSON input') {
        throw new Error('Invalid `default.json` was provided');
      }
      throw new Error(Config.evaluateConfigError(e, 'Could not find default.json configuration file'));
    }

    try {
      this.configuration = Object.assign(
        {},
        this.configuration,
        Config.getFile(this.CWD + `/src/config/env/${this.NODE_ENV}.json`),
      );
    } catch (e) {
      if (e instanceof SyntaxError && e.message === 'Unexpected end of JSON input') {
        throw new Error(`Invalid ${this.NODE_ENV}.json was provided`);
      }
      throw new Error(Config.evaluateConfigError(e, 'Could not find environment configuration file'));
    }

    return this;
  }

  protected static async getFileAsync(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          const parsed = JSON.parse(data, Config.JSONReviver);
          resolve(parsed);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  protected static getFile(filePath: string) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data, Config.JSONReviver);
    } catch (err) {
      return err;
    }
  }

  protected static JSONReviver(key: string, value: any) {
    if (key) {
      if (isPlainObject(value)) {
        const keys = Object.keys(value);
        return keys.reduce(
          (acc, _key) =>
            Object.assign({}, acc, {
              [_key]: Config.readEnv(value[_key]),
            }),
          {},
        );
      }
      return Config.readEnv(value);
    }
    return value;
  }

  protected static readEnv(value: any) {
    if (isString(value)) {
      const isEnvParams = /@@(?:(\w){1,})(?!\s)$/i.test(value.trim());
      if (isEnvParams) {
        const paramsValue = value.replace('@@', '');
        const env = process.env;
        return env[paramsValue];
      }
      return value;
    }

    return value;
  }

  protected static evaluateConfigError(error: any, message: string) {
    switch (error.code) {
      case 'ENOENT':
        return message;
      default:
        return error.message;
    }
  }
}

export const config = new Config().load();
