import axios from 'axios';
import { before, describe, it } from 'mocha';
import { expect } from 'chai';

import helloQuery from '../resolvers/hello-resolver-test';
import envRequest from '../../utils/env-request';
import { main } from '../..';

envRequest();

const URL = `http://localhost:${process.env.DB_HOST}`;

const startServer = async () => {
  await main();
};

describe('Testando a QUERY hello', () => {
  before('INICIANDO TESTES: ', async () => {
    startServer();
  });

  it("A QUERY deve retornar a string 'Hello, world!' ao ser chamada.", async () => {
    const response = await axios.post(URL, {
      query: helloQuery,
    });

    expect(response.status).to.equal(200);
    expect(response.data.data.hello).to.equal('Hello, world!');
  });
});
