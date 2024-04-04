import * as dotenv from 'dotenv';

type test = {
  DB_PORT: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_HOST: string;
  JWT_SECRET: string;
};

type development = {
  DB_PORT: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_HOST: string;
  JWT_SECRET: string;
};

type variablesType = development | test;

const envRequestVariables = (): variablesType => {
  dotenv.config();

  const envAmbientVariable = {
    test: {
      DB_PORT: process.env.DB_PORT_TEST,
      DB_HOST: process.env.DB_HOST_TEST,
      DB_USERNAME: process.env.DB_USERNAME_TEST,
      DB_PASSWORD: process.env.DB_PASSWORD_TEST,
      DB_DATABASE: process.env.DB_DATABASE_TEST,
      JWT_SECRET: process.env.JWT_SECRET_TEST,
    },
    development: {
      DB_PORT: process.env.DB_PORT_DEV,
      DB_HOST: process.env.DB_HOST_DEV,
      DB_USERNAME: process.env.DB_USERNAME_DEV,
      DB_PASSWORD: process.env.DB_PASSWORD_DEV,
      DB_DATABASE: process.env.DB_DATABASE_DEV,
      JWT_SECRET: process.env.JWT_SECRET_DEV,
    },
  };

  const ambient = process.env.NODE_ENV || 'development';
  const ambientSpecificVariables: variablesType = envAmbientVariable[ambient];

  return ambientSpecificVariables;
};

export default envRequestVariables;
