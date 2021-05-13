import { FilterQuery, Model, Query } from 'mongoose';
import { Pagination } from '../../../classes/pagination.class';
import { SchemaConfigs } from '../../../interfaces/database-options.interface';
import { isFunction, omit, isPlainObject } from 'lodash';
import { AppResponse } from '../../../classes/app-response.class';
import { QueryParser } from '../../../classes/query-parser.class';
import { Paginate } from '../../../interfaces/pagination.interface';
import { HttpResponse } from '../../../enums/http-response.enum';
import HttpStatus from '../../../enums/http-status.enum';


// TODO: Added a class called Aggregation Pipeline
// AggregationPipepline.$count().$expr().$or()
interface S extends Model<any> {
  schemaConfigs(): SchemaConfigs;
}
export class ServiceFactory<M extends S> {
  protected readonly collectionName: string;

  constructor(protected readonly model: M) {
    this.collectionName = model.collection.collectionName;
  }

  /**
   * Checks if a data exists in the DB
   * @param query
   * @returns {Boolean}
   */
  protected async isExisting(query: any) {
    if (isPlainObject(query)) {
      const itExists = await this.model.findOne(query).exec();

      return !!itExists;
    }
    return false;
  }

  /**
   * toResponse
   */
  protected async toResponse(options: Record<string, any>) {
    const queryParser = options?.query ? new QueryParser(options?.query) : null;
    const pagination = options?.pagination ? Pagination.fromObject(options?.pagination) : null;
    let value = options?.value;
    const count = options?.count;

    if (value && queryParser && queryParser?.population) {
      value = await this.model.populate(value, queryParser.population);
    }

    if (pagination && !options?.query?.all) {
      pagination.total = count;
      if (pagination.morePages(count)) {
        pagination.next = pagination.current + 1;
      }
    }

    const schemaConfigs = this.model.schemaConfigs();
    if (value && schemaConfigs?.hiddenFields?.length > 0) {
      if (Array.isArray(value)) {
        value = value.map((o) => omit(isFunction(value?.toJSON) ? o.toJSON() : o, ...schemaConfigs.hiddenFields));
      } else {
        value = omit(isFunction(value?.toJSON) ? value.toJSON() : value, ...schemaConfigs.hiddenFields);
      }
    }

    const http_response = HttpResponse[options?.status ?? HttpStatus.OK];
    const code = options?.code ?? http_response.status ?? HttpStatus.OK;
    return AppResponse.toResponse(Object.assign({}, options, { pagination, value, http_response, code }));
  }

  protected countQueryDocuments(query: any[]) {
    let count = this.model.aggregate(query.concat([{ $count: 'total' }]));
    count = count[0] ? count[0].total : 0;
    return count;
  }

  /**
   * @param {Object} pagination The pagination object
   * @param {Object} queryParser The query parser
   * @return {Object}
   */
  protected async buildModelQueryObject(pagination: Paginate, queryParser: QueryParser = null) {
    let query = this.model.find(queryParser.query);
    const schemaConfigs = this.model.schemaConfigs();

    if (queryParser.search && schemaConfigs.searchQuery(queryParser.search).length > 0) {
      const searchQuery = schemaConfigs.searchQuery(queryParser.search);
      queryParser.query = {
        $or: [...searchQuery],
        ...queryParser.query,
      };
      query = this.model.find({ ...queryParser.query });
    }
    if (!queryParser.all) {
      query = query.skip(pagination.skip).limit(pagination.per_page);
    }

    query = query.sort(queryParser ? Object.assign(queryParser.getSort(), { createdAt: -1 }) : '-createdAt');
    return {
      value: await query.select(queryParser.selection).exec(),
      count: await this.model.countDocuments(queryParser.query).exec(),
    };
  }

  /**
   * Builds a projection object given an array of projectors and projection type usually 0 | 1 for mongodb
   * @param projectors 
   * @param type 
   * @returns 
   */
  protected buildProjection(projectors: string[], type: 0 | 1 = 1): Record<string, number> {
    return projectors.reduce((acc: Record<string, number>, current: string) => {
      return { ...acc, [current]: type };
    }, {});
  }

  /**
   * Performs the findOne operation with an include projection
   * @param query 
   * @param include 
   * @returns 
   */
  protected findOneAndInclude(query: FilterQuery<any>, include: string[] = []): Query<any, any, {}> {
    const projections = this.buildProjection(include, 1);
    return this.model.findOne(query, projections);
  }

  /**
   * Performs the find operation with an include projection
   * @param query 
   * @param include 
   * @returns 
   */
  protected findAllAndInclude(query: FilterQuery<any>, include: string[] = []): Query<any, any, {}> {
    const projections = this.buildProjection(include, 1);
    return this.model.find(query, projections);
  }

  /**
   * Performs the findById operation with an include projection
   * @param id 
   * @param include 
   * @returns 
   */
  protected findByIdAndInclude(id: string, include: string[] = []): Query<any, any, {}> {
    const projections = this.buildProjection(include, 1);
    return this.model.findById(id, projections);
  }

  /**
   * Performs the findOne operation with an exclude projection
   * @param query 
   * @param exclude 
   * @returns 
   */
  protected findOneAndExclude(query: FilterQuery<any>, exclude: string[] = []): Query<any, any, {}> {
    const projections = this.buildProjection(exclude, 0);
    return this.model.findOne(query, projections);
  }

  /**
   * Performs the find operation with an exclude projection
   * @param query 
   * @param exclude 
   * @returns 
   */
  protected findAllAndExclude(query: FilterQuery<any>, exclude: string[] = []): Query<any, any, {}> {
    const projections = this.buildProjection(exclude, 0);
    return this.model.find(query, projections);
  }

  /**
   * Performs the findById operation with an exclude projection
   * @param id 
   * @param exclude 
   * @returns 
   */
  protected findByIdAndExclude(id: string, exclude: string[] = []): Query<any, any, {}> {
    const projections = this.buildProjection(exclude, 0);
    return this.model.findById(id, projections);
  }
}
