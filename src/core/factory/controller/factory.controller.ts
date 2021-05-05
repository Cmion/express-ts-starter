import { Router, Response, Request, NextFunction } from 'express';
import { flatten, toLower } from 'lodash';

interface ControllerFactoryInterface {
  method: string;
  guards?: ((request: Request, response: Response, next: NextFunction) => void)[];
  interceptors?: ((request: Request, response: Response, next: NextFunction) => void)[];
  handler: (request: Request, response: Response, next: NextFunction) => void;
  path: string;
}

type ExpressMiddleWareFunction = (request: Request, response: Response, next: NextFunction) => void;

export class ControllerFactory {
  protected readonly router: Router;
  guards: ExpressMiddleWareFunction[];
  interceptors: ExpressMiddleWareFunction[];
  private methods = ['get', 'put', 'patch', 'delete', 'post'];

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
   * Creates a controller given a controller interface
   * Maps the routes to a router, defaults to this.router.
   * @param controller
   * @param router
   * @returns
   */
  protected create(controller: ControllerFactoryInterface, router?: any) {
    if (!this.$evaluateMethods(controller.method)) {
      throw new RangeError(`${controller.method} not a method`);
    }

    const _method = toLower(controller.method);

    const _guards = this.guards.concat(controller.guards);

    const _interceptors = this.interceptors.concat(controller.interceptors);

    if (router) {
      router[_method](controller.path, flatten([_guards, controller.handler, _interceptors]));
      return;
    }
    this.router[_method](controller.path, flatten([_guards, controller.handler, _interceptors]));

    return this;
  }

  /**
   * Creates a group of routes [eg. router('/hello').get().post()]
   * @param groupPath
   * @param controllers
   * @returns {ControllerFactory}
   */
  public group(groupPath: string, controllers: ControllerFactoryInterface[]) {
    const groupRouter = this.router.route(groupPath);
    controllers.forEach((controller: ControllerFactoryInterface) => {
      this.create(controller, groupRouter);
    });
    return this;
  }

  /**
   * Handles posts routes
   * @param controller
   * @returns
   */
  public post(
    path: string,
    handler: ExpressMiddleWareFunction,
    controller?: Omit<ControllerFactoryInterface, 'method' | 'path' | 'handler'>,
  ) {
    this.create(Object.assign({}, controller, { method: 'post', path, handler }));
  }

  /**
   * Handles delete router for a given path
   * @param controller
   * @returns
   */
  public delete(
    path: string,
    handler: ExpressMiddleWareFunction,
    controller?: Omit<ControllerFactoryInterface, 'method' | 'path' | 'handler'>,
  ) {
    this.create(Object.assign({}, controller, { method: 'delete', path, handler }));
  }

  /**
   * Handles the get router for a given path
   * @param controller
   * @returns
   */
  public get(
    path: string,
    handler: ExpressMiddleWareFunction,
    controller?: Omit<ControllerFactoryInterface, 'method' | 'path' | 'handler'>,
  ) {
    this.create(Object.assign({}, controller, { method: 'get', path, handler }));
  }

  /**
   * Handles put request for a given path
   * @param controller
   * @returns
   */
  public put(
    path: string,
    handler: ExpressMiddleWareFunction,
    controller?: Omit<ControllerFactoryInterface, 'method' | 'path' | 'handler'>,
  ) {
    this.create(Object.assign({}, controller, { method: 'put', path, handler }));
  }

  /**
   * Handles patch request for a path
   * @param controller
   * @returns
   */
  public patch(
    path: string,
    handler: ExpressMiddleWareFunction,
    controller?: Omit<ControllerFactoryInterface, 'method' | 'path' | 'handler'>,
  ) {
    this.create(Object.assign({}, controller, { method: 'patch', path, handler }));
  }

  /**
   * Creates a multiple routes
   * @param controllers
   * @returns
   */
  public chain(controllers: Omit<ControllerFactoryInterface, 'method' | 'path' | 'handler'>[]) {
    controllers.forEach((controller: ControllerFactoryInterface) => {
      this.create(controller);
    });
    return this;
  }

  /**
   * Creates a controller object
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
  ): ControllerFactoryInterface {
    return { path, handler, guards, interceptors, method };
  }

  /**
   *
   * @param method
   * @returns
   */
  private $evaluateMethods(method: string) {
    const _method = toLower(method);
    return this.methods.includes(_method);
  }
}
