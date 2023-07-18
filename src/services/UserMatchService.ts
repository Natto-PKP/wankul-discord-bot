import type { CreateOptions, DestroyOptions, Includeable } from 'sequelize';
import { UserMatchModel, UserMatchData } from '../models';
import PaginationUtil, { PaginationOptions } from '../utils/PaginationUtil';

type UserMatchCreateData = Partial<UserMatchData>;

export default class UserMatchService {
  /**
   * add a match
   * @param userId - user id
   * @param matchId - match id
   * @param body - match data
   * @returns the created match
   */
  static async add(
    userId: string,
    matchId: string,
    body: UserMatchCreateData,
    options?: CreateOptions<any>,
  ) {
    return UserMatchModel.create({ userId, matchId, ...body }, options);
  }

  /**
   * remove a match
   * @param userId - user id
   * @param matchId - match id
   * @returns the removed match
   */
  static async remove(userId: string, matchId: string, options?: DestroyOptions<any>) {
    return UserMatchModel.destroy({ where: { userId, matchId }, ...options });
  }

  /**
   * find a match by id
   * @param userId - user id
   * @param matchId - match id
   * @returns the found match
   */
  static async get(userId: string, matchId: string) {
    return UserMatchModel.findOne({ where: { userId, matchId } });
  }

  /**
   * find all matches of a user
   * @param userId - user id
   * @returns all matches of the user
   */
  static async getAllByUserId(
    userId: string,
    pagination?: PaginationOptions,
    include: Includeable[] = [],
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    let options = { };

    if (pagination) {
      const limit = PaginationUtil.getLimit(pagination.limit);
      const page = PaginationUtil.getPage(pagination.page);
      const offset = pagination.offset || PaginationUtil.calcOffset(page, limit);

      options = {
        limit: limit + (pagination.getNextRow ? 1 : 0),
        offset,
      };
    }

    return UserMatchModel.findAll({
      where: { userId },
      include,
      order: [['createdAt', order]],
      ...options,
    });
  }
}
