import type { CreateOptions } from 'sequelize';
import { MatchModel, type MatchData } from '../models';
import type { PaginationOptions } from '../utils/PaginationUtil';
import PaginationUtil from '../utils/PaginationUtil';

type MatchCreateData = Partial<Omit<MatchData, 'identifier'>>;

export default class MatchService {
  /**
   * create a new match
   * @param data - match data
   * @returns the created match
   */
  static async create(data: MatchCreateData, options?: CreateOptions<any>) {
    return MatchModel.create(data, options);
  }

  /**
   * find a match by identifier
   * @param identifier - match identifier
   * @returns the found match
   */
  static async getByIdentifier(identifier: string) {
    return MatchModel.findOne({ where: { identifier } });
  }

  /**
   * find a match by id
   * @param id - match id
   * @returns the found match
   */
  static async get(id: string) {
    return MatchModel.findByPk(id);
  }

  /**
   * find all matches
   * @returns all matches
   */
  static async getAll(pagination: PaginationOptions = {}) {
    const limit = PaginationUtil.getLimit(pagination.limit);
    const page = PaginationUtil.getPage(pagination.page);
    const offset = PaginationUtil.calcOffset(page, limit);

    return MatchModel.findAll({ limit, offset });
  }
}
