import { Router, Response, Request, NextFunction } from 'express';
import { flatten, isFunction, isPlainObject, isString, toLower } from 'lodash';

export interface AdapterFactoryInterface {
  method: string;
  guards?: ((request: Request, response: Response, next: NextFunction) => void)[];
  interceptors?: ((request: Request, response: Response, next: NextFunction) => void)[];
  handler: (request: Request, response: Response, next: NextFunction) => void;
  path: string;
}

type ExpressMiddleWareFunction = (request: Request, response: Response, next: NextFunction) => void;

export class AdapterFactory {
  protected readonly router: Router;
  guards: ExpressMiddleWareFunction[];
  interceptors: ExpressMiddleWareFunction[];
  static methods = ['get', 'put', 'patch', 'delete', 'post'];

  constructor(guards: ExpressMiddleWareFunction[] = [], interceptors: ExpressMiddleWareFunction[] = []) {
    this.router = Router();
    this.guards = guards;
    this.interceptors = interceptors;
  }

  /**
   * Emits the router from the class.
   * @returns
   */
  public emit() {
    return this.router;
  }

  /**
   * Creates a adapter given a adapter interface
   * Maps the routes to a router, defaults to this.router.
   * @param adapter
   * @param router
   * @returns
   */
  protected create(adapter: AdapterFactoryInterface, router?: any) {
    if (!this.$evaluateMethods(adapter.method)) {
      throw new RangeError(`${adapter.method} not a method`);
    }

    const _method = toLower(adapter.method);

    const _guards = this.guards.concat(adapter.guards);

    const _interceptors = this.interceptors.concat(adapter.interceptors);

    if (router) {
      router[_method](adapter.path, flatten([_guards, adapter.handler, _interceptors]));
      return router;
    }
    this.router[_method](adapter.path, flatten([_guards, adapter.handler, _interceptors]));

    return this;
  }

  /**
   * Creates a group of routes [eg. router('/hello').get().post()]
   * @param groupPath
   * @param adapters
   * @returns {AdapterFactory}
   */
  public group(groupPath: string, ...adapters: AdapterFactoryInterface[]) {
    if (adapters.length) {
      const groupRouter = this.router.route(groupPath);
      adapters.forEach((adapter: AdapterFactoryInterface) => {
        if (AdapterFactory.isAdapterObject(adapter)) {
          this.create(adapter, groupRouter);
        } else {
          throw new Error('Adapter Factory: Invalid adapter object');
        }
      });
    }
    return this;
  }

  /**
   * Handles posts routes
   * @param adapter
   * @returns
   */
  public post(
    path: string,
    handler: ExpressMiddleWareFunction,
    adapter?: Omit<AdapterFactoryInterface, 'method' | 'path' | 'handler'>,
  ) {
    return this.create(Object.assign({}, adapter, { method: 'post', path, handler }));
  }

  /**
   * Handles delete router for a given path
   * @param adapter
   * @returns
   */
  public delete(
    path: string,
    handler: ExpressMiddleWareFunction,
    adapter?: Omit<AdapterFactoryInterface, 'method' | 'path' | 'handler'>,
  ) {
    return this.create(Object.assign({}, adapter, { method: 'delete', path, handler }));
  }

  /**
   * Handles the get router for a given path
   * @param adapter
   * @returns
   */
  public get(
    path: string,
    handler: ExpressMiddleWareFunction,
    adapter?: Omit<AdapterFactoryInterface, 'method' | 'path' | 'handler'>,
  ) {
    return this.create(Object.assign({}, adapter, { method: 'get', path, handler }));
  }

  /**
   * Handles put request for a given path
   * @param adapter
   * @returns
   */
  public put(
    path: string,
    handler: ExpressMiddleWareFunction,
    adapter?: Omit<AdapterFactoryInterface, 'method' | 'path' | 'handler'>,
  ) {
    return this.create(Object.assign({}, adapter, { method: 'put', path, handler }));
  }

  /**
   * Handles patch request for a path
   * @param adapter
   * @returns
   */
  public patch(
    path: string,
    handler: ExpressMiddleWareFunction,
    adapter?: Omit<AdapterFactoryInterface, 'method' | 'path' | 'handler'>,
  ) {
    return this.create(Object.assign({}, adapter, { method: 'patch', path, handler }));
  }

  /**
   * Creates a multiple routes
   * @param adapters
   * @returns
   */
  public chain(...adapters: AdapterFactoryInterface[]) {
    if (adapters.length) {
      adapters.forEach((adapter: AdapterFactoryInterface) => {
        if (AdapterFactory.isAdapterObject(adapter)) {
          this.create(adapter);
        } else {
          throw new Error('Adapter Factory: Invalid adapter object');
        }
      });
    }
    return this;
  }

  /**
   * Creates a adapter object
   * @param path
   * @param method
   * @param handler
   * @param guards
   * @param interceptors
   * @returns
   */
  static create(
    path: string,
    method: string,
    handler: ExpressMiddleWareFunction,
    guards: ExpressMiddleWareFunction[] = [],
    interceptors: ExpressMiddleWareFunction[] = [],
  ): AdapterFactoryInterface {
    return { path, handler, guards, interceptors, method: toLower(method) };
  }

  /**
   * Creates a post adapter object
   * @param path
   * @param handler
   * @param guards
   * @param interceptors
   * @returns
   */
  static post(
    path: string,
    handler: ExpressMiddleWareFunction,
    guards: ExpressMiddleWareFunction[] = [],
    interceptors: ExpressMiddleWareFunction[] = [],
  ): AdapterFactoryInterface {
    return { path, handler, guards, interceptors, method: 'post' };
  }

  /**
   * Creates a put adapter object
   * @param path
   * @param handler
   * @param guards
   * @param interceptors
   * @returns
   */
  static put(
    path: string,
    handler: ExpressMiddleWareFunction,
    guards: ExpressMiddleWareFunction[] = [],
    interceptors: ExpressMiddleWareFunction[] = [],
  ): AdapterFactoryInterface {
    return { path, handler, guards, interceptors, method: 'put' };
  }

  /**
   * Creates a patch adapter object
   * @param path
   * @param handler
   * @param guards
   * @param interceptors
   * @returns
   */
  static patch(
    path: string,
    handler: ExpressMiddleWareFunction,
    guards: ExpressMiddleWareFunction[] = [],
    interceptors: ExpressMiddleWareFunction[] = [],
  ): AdapterFactoryInterface {
    return { path, handler, guards, interceptors, method: 'patch' };
  }

  /**
   * Creates a get adapter object
   * @param path
   * @param handler
   * @param guards
   * @param interceptors
   * @returns
   */
  static get(
    path: string,
    handler: ExpressMiddleWareFunction,
    guards: ExpressMiddleWareFunction[] = [],
    interceptors: ExpressMiddleWareFunction[] = [],
  ): AdapterFactoryInterface {
    return { path, handler, guards, interceptors, method: 'get' };
  }

  /**
   * Creates a delete adapter object
   * @param path
   * @param handler
   * @param guards
   * @param interceptors
   * @returns
   */
  static delete(
    path: string,
    handler: ExpressMiddleWareFunction,
    guards: ExpressMiddleWareFunction[] = [],
    interceptors: ExpressMiddleWareFunction[] = [],
  ): AdapterFactoryInterface {
    return { path, handler, guards, interceptors, method: 'delete' };
  }

  /**
   *
   * @param method
   * @returns
   */
  private $evaluateMethods(method: string) {
    const _method = toLower(method);
    return AdapterFactory.methods.includes(_method);
  }

  static isAdapterObject(value: Record<string, any>) {
    if (!isPlainObject(value)) return false;

    const adapterKeys = ['method', 'guards', 'interceptors', 'path', 'handler'];
    const valueKeys = Object.keys(value);
    const hasAllProps = valueKeys.every((key) => adapterKeys.includes(key));

    if (!hasAllProps) return false;
    if (!AdapterFactory.methods.includes(value.method)) return false;
    if (!Array.isArray(value.interceptors)) return false;
    if (!Array.isArray(value.guards)) return false;
    if (!isString(value.path)) return false;
    if (!isFunction(value.handler)) return false;

    return true;
  }
}
