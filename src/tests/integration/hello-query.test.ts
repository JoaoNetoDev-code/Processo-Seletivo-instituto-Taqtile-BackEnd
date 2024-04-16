import axios from 'axios';
import { describe, it } from 'mocha';
import { expect } from 'chai';

import helloQuery from '../resolvers/hello-resolver-test';
import envRequest from '../../utils/env-request';

envRequest();

const URL = `http://localhost:${process.env.DB_HOST}`;

describe('Testando a QUERY hello', () => {
  it("A QUERY deve retornar a string 'Hello, world!' ao ser chamada.", async () => {
    const response = await axios.post(URL, {
      query: helloQuery,
    });

    expect(response.status).to.equal(200);
    expect(response.data.data.hello).to.equal('Hello, world!');
  });
});
