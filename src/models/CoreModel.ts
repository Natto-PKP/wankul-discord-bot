import {
  Column, DataType, Default, Model, PrimaryKey,
} from 'sequelize-typescript';

export interface CoreModelInterface {
  id: string;
}

export class CoreModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;
}
