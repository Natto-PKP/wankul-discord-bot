import {
  AllowNull, Column, DataType, Default, Unique, Table, BelongsToMany,
} from 'sequelize-typescript';
import { CoreModel, CoreModelInterface } from './CoreModel';
import { UserModel, UserMatchModel } from '.';

export interface MatchModelInterface extends CoreModelInterface {
  identifier: string;

  isCompetitive: boolean;
  isDraw: boolean;
  isCanceled: boolean;
  isFinished: boolean;

  // # Players
  players: UserModel[];
}

@Table({ tableName: 'matches' })
export class MatchModel extends CoreModel implements MatchModelInterface {
  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare identifier: string;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isCompetitive: boolean;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isCanceled: boolean;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isFinished: boolean;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isDraw: boolean;

  // # Players
  @BelongsToMany(() => UserModel, () => UserMatchModel)
  declare players: UserModel[];
}
