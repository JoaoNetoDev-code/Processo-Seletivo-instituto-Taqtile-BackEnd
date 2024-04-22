import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { User } from '../entity/user';

import { usersFactory } from './factory/user-factory';

import MainSeeder from './main.seed';

import envRequest from '../utils/env-request';
import { Address } from '../entity/address';
import { addressFactory } from './factory/address-factory';

envRequest();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'localhost',
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Address],
  factories: [usersFactory, addressFactory],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
console.log('novas seeds foram adicionadas >..<');
