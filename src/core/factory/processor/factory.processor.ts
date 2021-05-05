import { Model } from 'mongoose';
import { Pagination } from '../../../classes/pagination.class';
import { DBOptions } from '../../../interfaces/database-options.interface';
import { isFunction, omit, isPlainObject } from 'lodash';
import { AppResponse } from '../../../classes/app-response.class';
import { QueryParser } from '../../../classes/query-parser.class';
import { Paginate } from '../../../interfaces/pagination.interface';

export class ProcessorFactory<M extends Model<any>> {
  protected readonly collectionName: string;

  constructor(protected readonly model: M, protected readonly options: DBOptions) {
    this.collectionName = model.collection.collectionName;
  }

  /**
   * Checks if a data exists in the DB
   * @param query
   * @returns {Boolean}
   */
  protected isExisting(query: any) {
    if (isPlainObject(query)) {
      const itExists = this.model.findOne(query);

      return !!itExists;
    }
    return false;
  }

  /**
   * toResponse
   */
  protected async toResponse(options: Record<string, any>) {
    const queryParser = options?.queryParser;
    const pagination = Pagination.toObject(options?.pagination ?? {});
    let value;
    const count = options?.count;

    if (value && queryParser && queryParser?.population) {
      value = await this.model.populate(value, queryParser.population);
    }

    if (pagination && !queryParser.getAll) {
      pagination.total = count;
      if (pagination.morePages(count)) {
        pagination.next = pagination.current + 1;
      }
    }

    const dbOptions = this.options;
    if (dbOptions?.hiddenFields.length > 0) {
      if (Array.isArray(value)) {
        value = value.map((v) => omit(isFunction(value.toJSON) ? v.toJSON() : v, ...dbOptions.hiddenFields));
      } else {
        value = omit(isFunction ? value.toJSON() : value, ...dbOptions.hiddenFields);
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
    if (queryParser.search && this.options.searchQuery(queryParser.search).length > 0) {
      const searchQuery = this.options.searchQuery(queryParser.search);
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
