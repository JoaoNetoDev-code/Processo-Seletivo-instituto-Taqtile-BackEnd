import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user-resolver';
import { appDataSource } from './data-source';
import { Hello } from './resolvers/hello';
import formatError from './exceptionsClass/my-format-error';
import envRequest from './utils/env-request';
import { IMyContext } from './types/type-context';
import { AddressResolvers } from './resolvers/address-resolvers';
import { Container } from 'typedi';

envRequest();

export const main = async () => {
  await appDataSource.initialize();

  const schema = await buildSchema({
    resolvers: [Hello, UserResolver, AddressResolvers],
    validate: { forbidUnknownValues: false },
    container: Container,
  });

  const server = new ApolloServer({
    schema,
    debug: false,
    formatError,
    cache: 'bounded',
    context: ({ req }): IMyContext => {
      const authorization = req.headers['authorization'] || '';

      const token = authorization.replace('Bearer ', '');

      return { req, token };
    },
    cors: {
      origin: '*',
    },
  });

  await server
    .listen({ port: process.env.DB_HOST })
    .then(({ url }) =>
      console.log(`\n Iniciando serviço como: ${process.env.NODE_ENV}... \n Servidor on na porta: ${url}...`),
    );

  return server;
};
