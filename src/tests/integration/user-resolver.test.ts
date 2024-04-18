import axios, { AxiosResponse } from 'axios';
import { after, before, describe, it } from 'mocha';
import { expect } from 'chai';

import {
  createUserMutation,
  deleteUserMutation,
  getUserQuery,
  loginMutation,
  updateUserMutation,
} from '../resolvers/user-resolver-test';

import {
  CreateUserType,
  DeleteUserType,
  GetUsersType,
  LoginTypeReturn,
  UpdatedUserType,
} from '../../types/get-users-type';

import { appDataSource } from '../../data-source';
import { User } from '../../entity/user';

import { createUser, dateFuture } from '../mock-users/users-mock';
import argonUtil from '../../utils/argon-util';
import { main } from '../../main';
import jwtUtil from '../../utils/jwt-util';
import helloQuery from '../resolvers/hello-resolver-test';

const URL = `http://localhost:${process.env.DB_HOST}`;

describe('Testando user-resolver', async () => {
  const users = appDataSource.getRepository(User);
  let server;

  before('INICIANDO TESTES', async () => {
    server = await main();
  });

  after('DEPOIS DOS TESTES', async () => {
    await server.stop();
  });

  beforeEach('ANTES DE CADA TESTE', async () => {
    await users.clear();
  });

  afterEach('DEPOIS DE CADA TESTE', async () => {
    await users.clear();
  });

  it("A QUERY deve retornar a string 'Hello, world!' ao ser chamada.", async () => {
    const response = await axios.post(URL, {
      query: helloQuery,
    });

    expect(response.status).to.equal(200);
    expect(response.data.data.hello).to.equal('Hello, world!');
  });

  it('A QUERY getUser deve retornar todos os usuários do banco de dados.', async () => {
    const response: AxiosResponse<{ data: GetUsersType }> = await axios.post(URL, {
      query: getUserQuery,
    });

    const allUsers = await users.find();

    expect(response.status).to.equal(200);

    expect(response.data.data.getUsers).to.have.length(allUsers.length);
  });

  it('A MUTATION createUser deve retornar as informações do usuário criado em caso de SUCESSO.', async () => {
    const payload = { id: 1, name: 'User' };

    const token = jwtUtil.signToken(payload, true);

    const response: AxiosResponse<{ data: CreateUserType }> = await axios.post(
      URL,
      {
        query: createUserMutation,
        variables: {
          userData: createUser,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const userInsert = await users.findOne({ where: { id: response.data.data.createUser.id } });

    expect(response.status).to.equal(200);
    expect(response.data.data.createUser.name).to.deep.equal(userInsert.name);
    expect(response.data.data.createUser.email).to.deep.equal(userInsert.email);
    expect(response.data.data.createUser.id).to.deep.equal(userInsert.id);

    expect(response.data.data.createUser.name).to.deep.equal(createUser.name);
    expect(response.data.data.createUser.email).to.deep.equal(createUser.email);
  });

  it('A MUTATION createUser deve retornar um STATUS:200 e a mensagem: "Por favor, insira um endereço de e-mail válido." caso o atributo email seja inválido.', async () => {
    const response = await axios.post(URL, {
      query: createUserMutation,
      variables: {
        userData: { ...createUser, email: 'joao.com' },
      },
    });
    expect(response.status).to.equal(200);
    expect(response.data.errors[0].extensions.exception.validationErrors[0].constraints.isEmail).to.equal(
      'Por favor, insira um endereço de e-mail válido.',
    );
  });

  it('A MUTATION createUser deve retornar um STATUS:200 e a mensagem: "Deve ser uma data presente ou passada." caso o atributo birthDate seja uma data futura.', async () => {
    const response = await axios.post(URL, {
      query: createUserMutation,
      variables: {
        userData: { ...createUser, birthDate: dateFuture(10) },
      },
    });
    expect(response.status).to.equal(200);
    expect(response.data.errors[0].extensions.exception.validationErrors[0].constraints.maxDate).to.equal(
      'Deve ser uma data presente ou passada.',
    );
  });

  it('A MUTATION createUser deve retornar um STATUS:200 e a mensagem: "A senha deve ter no mínimo uma letra e um número." caso o password não possua os caracteres desejados.', async () => {
    const payload = { id: 1, name: 'User' };

    const token = jwtUtil.signToken(payload, true);

    const response = await axios.post(
      URL,
      {
        query: createUserMutation,
        variables: {
          userData: { ...createUser, password: '123454' },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    expect(response.status).to.equal(200);
    expect(response.data.errors[0].extensions.exception.validationErrors[0].constraints.matches).to.equal(
      'A senha deve ter no mínimo uma letra e um número.',
    );
  });

  it('A MUTATION createUser deve retornar um STATUS:200 e a mensagem: "A senha deve ter no mínimo 6 caracteres." caso o password não tenha um tamanho válido.', async () => {
    const response = await axios.post(URL, {
      query: createUserMutation,
      variables: {
        userData: { ...createUser, password: 'a1234' },
      },
    });

    expect(response.status).to.equal(200);
    expect(response.data.errors[0].extensions.exception.validationErrors[0].constraints.minLength).to.equal(
      'A senha deve ter no mínimo 6 caracteres.',
    );
  });

  it('A MUTATION updateUser deve ser capaz de retornar o objeto atualizado em caso de SUCESSO', async () => {
    const newUser = await users.save(createUser);

    const response: AxiosResponse<{ data: UpdatedUserType }> = await axios.post(URL, {
      query: updateUserMutation,
      variables: {
        updateUserId: newUser.id,
        userData: {
          name: 'joão Neto',
          birthDate: '12-18-1889',
          email: 'joaont@gmail.com',
          password: '123456d',
        },
      },
    });

    expect(response.status).to.equal(200);
    expect(response.data.data.updateUser.email).to.be.not.equal(newUser.email);
    expect(response.data.data.updateUser.name).to.be.not.equal(newUser.name);
    expect(response.data.data.updateUser.id).to.be.equal(newUser.id);
    expect(response.data.data.updateUser.birthDate).to.be.not.equal(newUser.birthDate);
  });

  it('A MUTATION updateUser deve ser capaz de atualizar o usuário independentemente da quantidade de parâmetros recebidos', async () => {
    const newUser = await users.save(createUser);

    const response: AxiosResponse<{ data: UpdatedUserType }> = await axios.post(URL, {
      query: updateUserMutation,
      variables: {
        updateUserId: newUser.id,
        userData: {
          name: 'sopa de caju',
          email: createUser.email,
          birthDate: '12-18-1998',
        },
      },
    });

    expect(response.status).to.equal(200);

    expect(response.data.data.updateUser.id).to.be.equal(newUser.id);

    expect(response.data.data.updateUser.email).to.be.equal(newUser.email);

    expect(response.data.data.updateUser.birthDate).to.be.not.equal(newUser.birthDate);

    expect(response.data.data.updateUser.name).to.be.not.equal(newUser.name);
  });

  it('A MUTATION login deve ser capaz de retornar o STATUS 401 ea mensagem "Usuário ou senha inválidos." caso o usuario envie uma email ou senha errada.', async () => {
    const senhaSuperForte = await argonUtil.signHashPassword('asd123');

    const newUser = await users.save({ ...createUser, password: senhaSuperForte });

    const response = await axios.post(URL, {
      query: loginMutation,
      variables: {
        loginUser: {
          email: newUser.email,
          password: 'asd1234',
          rememberMe: true,
        },
      },
    });

    expect(response.data.errors[0].code).to.be.equal(401);
    expect(response.data.errors[0].message).to.be.equal('Usuário ou senha inválidos.');
  });

  it('A MUTATION login deve ser capaz de retornar o usuário mas o token da sessão em caso de sucesso:', async () => {
    const senhaSuperForte = await argonUtil.signHashPassword('asd123');
    const newUser = await users.save({ ...createUser, password: senhaSuperForte });

    const response: AxiosResponse<{ data: LoginTypeReturn }> = await axios.post(URL, {
      query: loginMutation,
      variables: {
        loginUser: {
          email: newUser.email,
          password: 'asd123',
          rememberMe: true,
        },
      },
    });

    expect(response.status).to.be.equal(200);
    expect(response.data.data.login).to.have.all.keys('user', 'token');
    expect(response.data.data.login.user).to.have.all.keys('id', 'email', 'birthDate', 'name');
  });

  it('A MUTATION deleteUser deve retornar o STATUS:200 e a mensagem: "Usuário não encontrado." caso não encontre o usuário do id recebido.', async () => {
    const response = await axios.post(URL, {
      query: deleteUserMutation,
      variables: { deleteUserId: 0 },
    });

    expect(response.status).to.equal(200);
    expect(response.data.errors[0].message).to.equal('Usuário não encontrado.');
  });

  it('A MUTATION deleteUser deve retornar o usuário removido em caso de SUCESSO.', async () => {
    const newUser = await users.save(createUser);

    const response: AxiosResponse<{ data: DeleteUserType }> = await axios.post(URL, {
      query: deleteUserMutation,
      variables: { deleteUserId: newUser.id },
    });

    expect(response.status).to.equal(200);
    expect(response.data.data.deleteUser).to.be.equal('Usuário removido com sucesso!');
  });
});
