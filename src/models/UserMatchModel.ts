import {
  AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Model, Table,
} from 'sequelize-typescript';
import { UserModel } from './UserModel';
import { MatchModel } from './MatchModel';

export type UserMatchData = {
  isWinner: boolean;
  isDraw: boolean;
  opponentId: string;
};

export type UserMatchModelInterface = UserMatchData & {
  userId: string;
  matchId: string;

  user: UserModel;
  opponent: UserModel;
  match: MatchModel;
};

@Table({ tableName: 'user_matches', indexes: [{ fields: ['user_id', 'match_id'], unique: true }] })
export class UserMatchModel extends Model implements UserMatchModelInterface {
  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN })
  declare isWinner: boolean;

  @AllowNull(false)
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isDraw: boolean;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.STRING })
  declare opponentId: string;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.STRING })
  declare userId: string;

  @AllowNull(false)
  @ForeignKey(() => MatchModel)
  @Column({ type: DataType.STRING })
  declare matchId: string;

  // # Associations
  @BelongsTo(() => UserModel)
  declare user: UserModel;

  @BelongsTo(() => UserModel)
  declare opponent: UserModel;

  @BelongsTo(() => MatchModel)
  declare match: MatchModel;
}
