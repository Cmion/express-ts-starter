import { QueryParser } from '../../classes/query-parser.class';
import {Response, Request, NextFunction} from 'express';

const ResponseInterceptor = (request: Request, response: Response, next: NextFunction) => {
    const queryParser = new QueryParser(Object.assign({}, request.query));
    const requestResponse =  request.response;
}

export default ResponseInterceptor