import { Sequelize } from 'sequelize-typescript';

import { UserModel, UserMatchModel, MatchModel } from './models';

const database = new Sequelize({
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  dialect: 'postgres',

  define: { underscored: true },
  logging: false,
  models: [UserModel, UserMatchModel, MatchModel],
});

// database.sync({ alter: true });
// database.sync({ force: true });
// database.drop({ cascade: true });

export default database;
