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
  static async create(data: UserCreateData) {
    return UserModel.create(data);
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
  static async getAll(pagination: PaginationOptions = {}) {
    const limit = PaginationUtil.getLimit(pagination.limit);
    const page = PaginationUtil.getPage(pagination.page);
    const offset = PaginationUtil.calcOffset(page, limit);

    return UserModel.findAll({ limit, offset });
  }

  /**
   * update a user
   * @param id - user id
   * @param data - user data
   * @returns the updated user
   */
  static async update(id: string, data: UserUpdateData) {
    return UserModel.update(data, { where: { id } });
  }

  /**
   * delete a user
   * @param id - user id
   * @returns the deleted user
   */
  static async delete(id: string) {
    return UserModel.destroy({ where: { id } });
  }
}
