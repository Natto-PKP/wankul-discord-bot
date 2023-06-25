import {
  AllowNull, Column, DataType, Default, ForeignKey, Model, Table,
} from 'sequelize-typescript';
import { UserModel } from './UserModel';
import { MatchModel } from './MatchModel';

export interface UserMatchModelInterface {
  isWinner: boolean;
  isLoser: boolean;
  isDraw: boolean;

  userId: string;
  matchId: string;
}

@Table({ tableName: 'user_matches', indexes: [{ fields: ['user_id', 'match_id'], unique: true }] })
export class UserMatchModel extends Model implements UserMatchModelInterface {
  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isWinner: boolean;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isLoser: boolean;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isDraw: boolean;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.STRING })
  declare userId: string;

  @AllowNull(false)
  @ForeignKey(() => MatchModel)
  @Column({ type: DataType.STRING })
  declare matchId: string;
}
