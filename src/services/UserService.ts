import { UserModel, type UserData } from '../models';

type UserCreateData = Pick<UserData, 'discordId'>;
type UserUpdateData = Partial<Omit<UserData, 'discordId' | 'identifier'>>;

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
  static async findByDiscordId(discordId: string) {
    return UserModel.findOne({ where: { discordId } });
  }

  /**
   * find a user by identifier
   * @param identifier - identifier
   * @returns the found user
   */
  static async findByIdentifier(identifier: string) {
    return UserModel.findOne({ where: { identifier } });
  }

  /**
   * find all users
   * @returns - all users
   */
  static async findAll() {
    return UserModel.findAll();
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
