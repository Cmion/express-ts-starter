import { Types } from 'mongoose';
import { has, isPlainObject, isString, omit, extend } from 'lodash';
import logger from '../setup/logger.setup';

export class QueryParser {
  all: boolean;
  sort: Record<string, any> | string;
  population: any[];
  selection: string;
  search: string;
  query: Record<string, any>;
  private excludedQueries: string[] = [
    'per_page',
    'page',
    'limit',
    'sort',
    'all',
    'includes',
    'selection',
    'population',
    'search',
    'regex',
    'nested',
  ];

  constructor(query: Record<string, any>) {
    this.initialize(query);
    // omit special query string keys from query before passing down to the model for filtering
    this.query = omit(this.query, ...this.excludedQueries);

    // Only get collection that has not been virtually deleted.
    extend(this.query, { deleted: false });
  }

  private initialize(query: Record<string, any>) {
    this.all = query.all;
    this.sort = query.sort;
    if (query.population) {
      this.population = query.population;
    }
    if (query.selection) {
      this.selection = query.selection;
    }
    if (query.search) {
      this.search = query.search;
    }
    if (query.nested) {
      this.query = { ...this.query, ...this.processNestedQuery(query) };
    }
    if (query.regex) {
      this.query = { ...this.query, ...this.processRegSearch(query) };
    }
  }

  /**
   * @param {Object} query is the population object
   * @return {Object} get the parsed query
   */
  processNestedQuery(query: Record<string, any>) {
    let value = query?.nested;
    let result = {};
    if (value) {
      try {
        value = JSON.parse(value.toString());
        for (const filter of value) {
          if (has(filter, 'key') && has(filter, 'value')) {
            if (filter?.value?.in_array) {
              filter.value = { $in: filter?.value?.in_array?.filter?.((v) => Types.ObjectId.isValid(v)) };
            }
            result[filter?.key] = filter?.value;
          }
        }
      } catch (e) {
        logger.debug(e);
      }
    }
    return result;
  }

  /**
   * @param {Object} query is the population object
   * @return {Object} get the parsed query
   */
  processRegSearch(query: Record<string, any>) {
    const value = query?.regex;
    const result = {};
    if (isPlainObject(value)) {
      try {
        const regex = JSON.parse(value.toString());
        for (const r of regex) {
          const q = new RegExp(r.value);
          result[r.key] = { $regex: q, $options: 'i' };
        }
      } catch (e) {
        logger.debug(e);
      }
    }
    return result;
  }

  /**
   * @param {Object} value is the population object
   */
  populate(value: string | Record<string, any>) {
    if (!Array.isArray(value)) {
      try {
        this.population = JSON.parse(value.toString());
      } catch (e) {
        logger.debug(e);
      }
    }
  }

  setQuery(query: Record<string, any>) {
    this.query = query;
  }

  getSort() {
    if (this.sort) {
      if (!isPlainObject(this.sort)) {
        try {
          this.sort = JSON.parse(this.sort as string);
        } catch (e) {
          return { [this.sort as string]: 1 };
        }
      }

      for (const [column, direction] of Object.entries(this.sort)) {
        if (isString(direction)) {
          this.sort[column] = direction.toLowerCase() === 'asc' ? 1 : -1;
        }
      }

      return this.sort;
    }
    return { createdAt: -1 };
  }
}
