import {
  AllowNull,
  BelongsToMany,
  Column,
  DataType,
  Default,
  Table,
  Unique,
} from 'sequelize-typescript';
import { CoreModelInterface, CoreModel } from './CoreModel';
import IdentifierService from '../utils/IdentifierUtil';
import { MatchModel, UserMatchModel } from '.';

export enum UserType {
  Collector = 'COLLECTOR',
  Player = 'PLAYER',
}

export type UserData = {
  identifier: string;
  discordId: string; // # Discord ID

  // # Leveling
  level: number;
  experience: number; // # Experience is counted in the level

  // # Rating
  rating: number;
  victories: number; // # Victories are counted in the rating
  defeats: number; // # Defeats are counted in the rating
  draws: number; // # Draws are not counted in the rating
  excluded: boolean; // # If the user is excluded from the ranking
};

export type UserModelInterface = UserData & CoreModelInterface & {

  // # Matches
  matches: MatchModel[];
};

@Table({ tableName: 'users' })
export class UserModel extends CoreModel implements UserModelInterface {
  @Unique
  @AllowNull(false)
  @Default(() => IdentifierService.generate({ characters: ['lower'], length: 7 }))
  @Column({ type: DataType.STRING })
  declare identifier: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare discordId: string;

  // # Leveling
  @Default(1)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare level: number;

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare experience: number;

  // # Rating
  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare rating: number;

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare victories: number;

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare defeats: number;

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare draws: number;

  @Default(false)
  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN })
  declare excluded: boolean;

  // # Matches
  @BelongsToMany(() => MatchModel, () => UserMatchModel)
  declare matches: MatchModel[];
}
