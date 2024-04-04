import 'reflect-metadata';

import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user-resolver';
import { appDataSource } from './data-source';
import { Hello } from './resolvers/hello';
import envRequestVariables from './utils/request-variables';
import formatError from './exceptionsClass/my-format-error';

const port = envRequestVariables().DB_HOST;

const mode = process.env.NODE_ENV;

const main = async () => {
  await appDataSource.initialize();

  const schema = await buildSchema({
    resolvers: [Hello, UserResolver],
  });

  const server = new ApolloServer({
    schema,
    debug: false,
    formatError,
  });

  await server
    .listen({ port })
    .then(({ url }) => console.log(`\n Iniciando serviço em no modo: ${mode}... \n Servidor on na porta: ${url}...`));
};

main();
