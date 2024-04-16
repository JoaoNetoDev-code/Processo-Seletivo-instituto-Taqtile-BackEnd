import 'reflect-metadata';

import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user-resolver';
import { appDataSource } from './data-source';
import { Hello } from './resolvers/hello';
import formatError from './exceptionsClass/my-format-error';
import envRequest from './utils/env-request';

envRequest();

export const main = async () => {
  await appDataSource.initialize();

  const schema = await buildSchema({
    resolvers: [Hello, UserResolver],
  });

  const server = new ApolloServer({
    schema,
    debug: false,
    formatError,
    cors: {
      origin: '*',
    },
  });

  await server
    .listen({ port: process.env.DB_HOST })
    .then(({ url }) =>
      console.log(`\n Iniciando serviço como: ${process.env.NODE_ENV}... \n Servidor on na porta: ${url}...`),
    );
};

main();
