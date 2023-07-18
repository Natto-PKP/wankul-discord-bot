import {
  CreateOptions, DestroyOptions, FindOptions, Op, Sequelize, UpdateOptions, WhereOptions,
} from 'sequelize';
import { UserModel, type UserData } from '../models';
import type { PaginationOptions } from '../utils/PaginationUtil';
import PaginationUtil from '../utils/PaginationUtil';

type UserCreateData = Pick<UserData, 'discordId'>;
type UserUpdateData = Partial<Omit<UserData, 'discordId' | 'identifier'>>;

export enum UserType {
  Player = 'PLAYER',
  Collector = 'COLLECTOR',
}

export default class UserService {
  /**
   * create a new user
   * @param data - user data
   * @returns the created user
   */
  static async create(data: UserCreateData, options?: CreateOptions<any>) {
    return UserModel.create(data, options);
  }

  /**
   * find a user by discord id
   * @param discordId - discord id
   * @returns the found user
   */
  static async getByDiscordId(discordId: string) {
    return UserModel.findOne({ where: { discordId } });
  }

  /**
   * find a user by identifier
   * @param identifier - identifier
   * @returns the found user
   */
  static async getByIdentifier(identifier: string) {
    return UserModel.findOne({ where: { identifier } });
  }

  /**
   * find a user by id
   * @param id - user id
   * @returns the found user
   */
  static async get(id: string) {
    return UserModel.findByPk(id);
  }

  /**
   * find all users
   * @returns - all users
   */
  static async getAll(
    where: WhereOptions<any> = { },
    pagination: PaginationOptions = {},
    options?: Partial<FindOptions<any>>,
  ) {
    const limit = PaginationUtil.getLimit(pagination.limit);
    const page = PaginationUtil.getPage(pagination.page);
    const offset = PaginationUtil.calcOffset(page, limit);

    return UserModel.findAll({
      limit, offset, where, ...options,
    });
  }

  /**
   * update a user
   * @param id - user id
   * @param data - user data
   * @returns the updated user
   */
  static async update(id: string, data: UserUpdateData, options?: Partial<UpdateOptions<any>>) {
    return UserModel.update(data, { where: { id }, ...options });
  }

  /**
   * delete a user
   * @param id - user id
   * @returns the deleted user
   */
  static async delete(id: string, options?: DestroyOptions<any>) {
    return UserModel.destroy({ where: { id }, ...options });
  }

  /**
   * get the user ranking
   * @param id - user id
   */
  static async addPoints(id: string, points: number, options?: Partial<UpdateOptions<any>>) {
    await UserModel.update({ points: Sequelize.literal(`"rating" + ${points}`) }, { where: { id }, ...options });
  }

  /**
   * get the user ranking
   * @param id - user id
   */
  static async removePoints(id: string, points: number, options?: Partial<UpdateOptions<any>>) {
    await UserModel.update({ points: Sequelize.literal(`"rating" - ${points}`) }, { where: { id }, ...options });
  }

  /**
   * get the user ranking
   * @param id - user id
   */
  static async addVictory(id: string, options?: Partial<UpdateOptions<any>>) {
    await UserModel.update({ victories: Sequelize.literal('"victories" + 1') }, { where: { id }, ...options });
  }

  /**
   * get the user ranking
   * @param id - user id
   */
  static async addDefeat(id: string, options?: Partial<UpdateOptions<any>>) {
    await UserModel.update({ defeats: Sequelize.literal('"defeats" + 1') }, { where: { id }, ...options });
  }

  /**
   * get the user ranking
   * @param id - user id
   */
  static async addDraw(id: string, options?: Partial<UpdateOptions<any>>) {
    await UserModel.update({ draws: Sequelize.literal('"draws" + 1') }, { where: { id }, ...options });
  }

  /**
   * get the user ranking
   * @param id - user id
   * @returns the user ranking
   */
  static async getPositionByRating(rating: number) {
    return UserModel.count({ where: { rating: { [Op.gt]: rating } } });
  }
}
