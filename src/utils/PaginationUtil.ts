const MIN_LIMIT = 0;
const MAX_LIMIT = 200;

export type PaginationOptions = {
  limit?: number;
  page?: number;
  offset?: number;
  getNextRow?: boolean
};

export default class PaginationUtil {
  static getLimit(limit = MAX_LIMIT, min = MIN_LIMIT, max = MAX_LIMIT) {
    if (limit < min) return min;
    if (limit > max) return max;
    return limit;
  }

  static getPage(page = 0) {
    return page < 0 ? 0 : page;
  }

  static calcOffset(page: number, limit: number) {
    return page * limit;
  }
}
