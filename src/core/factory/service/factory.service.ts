import { Model } from 'mongoose';
import { Pagination } from '../../../classes/pagination.class';
import { SchemaConfigs } from '../../../interfaces/database-options.interface';
import { isFunction, omit, isPlainObject } from 'lodash';
import { AppResponse } from '../../../classes/app-response.class';
import { QueryParser } from '../../../classes/query-parser.class';
import { Paginate } from '../../../interfaces/pagination.interface';

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
    const queryParser = options?.query ? new QueryParser(options?.query): null;
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

    return AppResponse.toResponse(Object.assign({}, options, { pagination, value }));
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
}
