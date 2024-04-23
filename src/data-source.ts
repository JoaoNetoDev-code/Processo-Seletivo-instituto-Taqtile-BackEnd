import { DataSource } from 'typeorm';
import { User } from './entity/user';
import envRequest from './utils/env-request';
import { Address } from './entity/address';

envRequest();

export const appDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: false,
  migrations: [__dirname + './migrations'],
  entities: [User, Address],
  subscribers: [],
});
