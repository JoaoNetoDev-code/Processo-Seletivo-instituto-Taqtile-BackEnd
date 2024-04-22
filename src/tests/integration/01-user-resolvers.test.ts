import axios, { AxiosResponse } from 'axios';
import { after, before, describe, it } from 'mocha';
import { expect } from 'chai';

import {
  createUserMutation,
  deleteUserMutation,
  findUserForIdQuery,
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
  findForIdUserType,
} from '../../types/get-users-type';

import { appDataSource } from '../../data-source';
import { User } from '../../entity/user';

import { createUserMock, dateFuture } from '../mock-users/users-mock';
import argonUtil from '../../utils/argon-util';
import { main } from '../../main';
import jwtUtil from '../../utils/jwt-util';
import helloQuery from '../resolvers/hello-resolver-test';
import { GetAllAddressType } from '../../types/address-type';
import { createAddress } from '../resolvers/address-resolver-test';
import { Address } from '../../entity/address';
import { createAddressMock } from '../mock-users/address-mock';

const URL = `http://localhost:${process.env.DB_HOST}`;

describe.only('Testes de E2E.', async () => {
  const payload = { id: 1, name: 'User' };
  const token = jwtUtil.signToken(payload, true);
  const userRepository = appDataSource.getRepository(User);
  const addressRepository = appDataSource.getTreeRepository(Address);
  let server;

  before('ANTES DE INICIAR OS TESTES', async () => {
    server = await main();
  });

  after('AO TÉRMINO DOS TESTES', async () => {
    await server.stop();
  });

  beforeEach('ANTES DE CADA TESTE', async () => {
    await userRepository.delete({});
  });

  afterEach('DEPOIS DE CADA TESTE', async () => {
    await userRepository.delete({});
  });

  context('Testes E2E para address-resolver', async () => {
    it('a Mutation createAddress deve retornar o address criado no banco.', async () => {
      const user = await userRepository.save(createUserMock());
      const address = createAddressMock(user.id);

      const response: AxiosResponse<{ data: GetAllAddressType }> = await axios.post(
        URL,
        {
          query: createAddress,
          variables: {
            address,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const addressCreated = await addressRepository.findOne({ where: { id: response.data.data.createAddress.id } });

      expect(response.status).to.equal(200);
      expect(response.data.data.createAddress.cep).to.deep.equal(addressCreated.cep);
      expect(response.data.data.createAddress.city).to.deep.equal(addressCreated.city);
      expect(response.data.data.createAddress.complement).to.deep.equal(addressCreated.complement);
      expect(response.data.data.createAddress.neighborhood).to.deep.equal(addressCreated.neighborhood);
      expect(response.data.data.createAddress.state).to.deep.equal(addressCreated.state);
      expect(response.data.data.createAddress.street).to.deep.equal(addressCreated.street);
      expect(response.data.data.createAddress.streetNumber).to.deep.equal(addressCreated.streetNumber);
      expect(response.data.data.createAddress.userId).to.deep.equal(addressCreated.userId);
    });

    it('a Mutation createAddress deve retorna um status code:401 e a mensagem: "você precisa estar autenticado para realizar essa ação" quando não encontrar um token valido no header.', async () => {
      const user = await userRepository.save(createUserMock());
      const address = createAddressMock(user.id);

      const response = await axios.post(
        URL,
        {
          query: createAddress,
          variables: {
            address,
          },
        },
        {
          headers: {
            Authorization: `Bearer xablauziho`,
          },
        },
      );

      expect(response.data.errors[0].code).to.equal(401);
      expect(response.data.errors[0].message).to.equal('você precisa estar autenticado para realizar essa ação');
    });
  });

  context('Testes E2E para user-resolver', async () => {
    it("A QUERY deve retornar a string 'Hello, world!' ao ser chamada.", async () => {
      const response = await axios.post(URL, {
        query: helloQuery,
      });

      expect(response.status).to.equal(200);
      expect(response.data.data.hello).to.equal('Hello, world!');
    });

    it('A QUERY getUser deve retorna um status code:401 e a mensagem: "você precisa estar autenticado para realizar essa ação" quando não encontrar um token valido no header.', async () => {
      const response = await axios.post(
        URL,
        {
          query: getUserQuery,
          variables: {
            limit: 1,
            page: 1,
          },
        },
        {
          headers: {
            Authorization: 'Bearer tokentodoerrrado',
          },
        },
      );

      expect(response.data.errors[0].code).to.equal(401);
      expect(response.data.errors[0].message).to.equal('você precisa estar autenticado para realizar essa ação');
    });

    it('A QUERY getUser deve retorna um status code:200 e a os dados do user quando chamada com um token valido no header.', async () => {
      const response: AxiosResponse<{ data: GetUsersType }> = await axios.post(
        URL,
        {
          query: getUserQuery,
          variables: {
            limit: 1,
            page: 1,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const users = await userRepository.find();

      expect(response.status).to.equal(200);
      expect(response.data.data.getUsers.length).to.equal(users.length);
    });

    it('A MUTATION createUser deve retornar as informações do usuário criado em caso de SUCESSO.', async () => {
      const userCreate = createUserMock();

      const response: AxiosResponse<{ data: CreateUserType }> = await axios.post(
        URL,
        {
          query: createUserMutation,
          variables: {
            userData: userCreate,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const userInsert = await userRepository.findOne({ where: { id: response.data.data.createUser.id } });

      expect(response.status).to.equal(200);
      expect(response.data.data.createUser.name).to.deep.equal(userInsert.name);
      expect(response.data.data.createUser.email).to.deep.equal(userInsert.email);
      expect(response.data.data.createUser.id).to.deep.equal(userInsert.id);

      expect(response.data.data.createUser.name).to.deep.equal(userCreate.name);
      expect(response.data.data.createUser.email).to.deep.equal(userCreate.email);
    });

    it('A MUTATION createUser deve retorna um status code:401 e a mensagem: "você precisa estar autenticado para realizar essa ação" quando não encontrar um token valido no header.', async () => {
      const userCreate = createUserMock();

      const response = await axios.post(
        URL,
        {
          query: createUserMutation,
          variables: {
            userData: userCreate,
          },
        },
        {
          headers: {
            Authorization: `Bearer asasasa`,
          },
        },
      );
      expect(response.data.errors[0].code).to.equal(401);
      expect(response.data.errors[0].message).to.equal('você precisa estar autenticado para realizar essa ação');
    });

    it('A MUTATION createUser deve retornar um STATUS:200 e a mensagem: "Por favor, insira um endereço de e-mail válido." caso o atributo email seja inválido.', async () => {
      const user = createUserMock();
      const response = await axios.post(
        URL,
        {
          query: createUserMutation,
          variables: {
            userData: { ...user, email: 'joao.com' },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      expect(response.status).to.equal(200);
      expect(response.data.errors[0].extensions.exception.validationErrors[0].constraints.isEmail).to.equal(
        'Por favor, insira um endereço de e-mail válido.',
      );
    });

    it('A MUTATION createUser deve retornar um STATUS:200 e a mensagem: "Deve ser uma data presente ou passada." caso o atributo birthDate seja uma data futura.', async () => {
      const user = createUserMock();
      const response = await axios.post(
        URL,
        {
          query: createUserMutation,
          variables: {
            userData: { ...user, birthDate: dateFuture(10) },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      expect(response.status).to.equal(200);
      expect(response.data.errors[0].extensions.exception.validationErrors[0].constraints.maxDate).to.equal(
        'Deve ser uma data presente ou passada.',
      );
    });

    it('A MUTATION createUser deve retornar um STATUS:200 e a mensagem: "A senha deve ter no mínimo uma letra e um número." caso o password não possua os caracteres desejados.', async () => {
      const user = createUserMock();

      const response = await axios.post(
        URL,
        {
          query: createUserMutation,
          variables: {
            userData: { ...user, password: '123454' },
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
      const user = createUserMock();
      const response = await axios.post(
        URL,
        {
          query: createUserMutation,
          variables: {
            userData: { ...user, password: 'a1234' },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      expect(response.status).to.equal(200);
      expect(response.data.errors[0].extensions.exception.validationErrors[0].constraints.minLength).to.equal(
        'A senha deve ter no mínimo 6 caracteres.',
      );
    });

    it('A MUTATION updateUser deve ser capaz de retornar o objeto atualizado em caso de SUCESSO', async () => {
      const newUser = await userRepository.save(createUserMock());

      const response: AxiosResponse<{ data: UpdatedUserType }> = await axios.post(
        URL,
        {
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
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      expect(response.status).to.equal(200);
      expect(response.data.data.updateUser.email).to.be.not.equal(newUser.email);
      expect(response.data.data.updateUser.name).to.be.not.equal(newUser.name);
      expect(response.data.data.updateUser.id).to.be.equal(newUser.id);
      expect(response.data.data.updateUser.birthDate).to.be.not.equal(newUser.birthDate);
    });

    it('A MUTATION updateUser deve ser capaz de atualizar o usuário independentemente da quantidade de parâmetros recebidos', async () => {
      const newUser = await userRepository.save(createUserMock());

      const response: AxiosResponse<{ data: UpdatedUserType }> = await axios.post(
        URL,
        {
          query: updateUserMutation,
          variables: {
            updateUserId: newUser.id,
            userData: {
              name: 'sopa de caju',
              email: newUser.email,
              birthDate: '12-18-1998',
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      expect(response.status).to.equal(200);

      expect(response.data.data.updateUser.id).to.be.equal(newUser.id);

      expect(response.data.data.updateUser.email).to.be.equal(newUser.email);

      expect(response.data.data.updateUser.birthDate).to.be.not.equal(newUser.birthDate);

      expect(response.data.data.updateUser.name).to.be.not.equal(newUser.name);
    });

    it('A MUTATION updateUser deve retorna um status code:401 e a mensagem: "você precisa estar autenticado para realizar essa ação" quando não encontrar um token valido no header.', async () => {
      const newUser = await userRepository.save(createUserMock());

      const response = await axios.post(
        URL,
        {
          query: updateUserMutation,
          variables: {
            updateUserId: newUser.id,
            userData: {
              name: 'sopa de caju',
              email: newUser.email,
              birthDate: '12-18-1998',
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer asdads`,
          },
        },
      );

      expect(response.data.errors[0].code).to.equal(401);
      expect(response.data.errors[0].message).to.equal('você precisa estar autenticado para realizar essa ação');
    });

    it('A MUTATION login deve ser capaz de retornar o STATUS 401 ea mensagem "Usuário ou senha inválidos." caso o usuario envie uma email ou senha errada.', async () => {
      const senhaSuperForte = await argonUtil.signHashPassword('asd123');
      const user = createUserMock();

      const newUser = await userRepository.save({ ...user, password: senhaSuperForte });

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
      const user = createUserMock();
      const newUser = await userRepository.save({ ...user, password: senhaSuperForte });

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
      const response = await axios.post(
        URL,
        {
          query: deleteUserMutation,
          variables: { deleteUserId: 0 },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      expect(response.status).to.equal(200);
      expect(response.data.errors[0].message).to.equal('Usuário não encontrado.');
    });

    it('A MUTATION deleteUser deve retornar o usuário removido em caso de SUCESSO.', async () => {
      const newUser = await userRepository.save(createUserMock());

      const response: AxiosResponse<{ data: DeleteUserType }> = await axios.post(
        URL,
        {
          query: deleteUserMutation,
          variables: { deleteUserId: newUser.id },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      expect(response.status).to.equal(200);
      expect(response.data.data.deleteUser).to.be.equal('Usuário removido com sucesso!');
    });

    it('A MUTATION deleteUser deve retorna um status code:401 e a mensagem: "você precisa estar autenticado para realizar essa ação" quando não encontrar um token valido no header.', async () => {
      const newUser = await userRepository.save(createUserMock());

      const response = await axios.post(
        URL,
        {
          query: deleteUserMutation,
          variables: { deleteUserId: newUser.id },
        },
        {
          headers: {
            Authorization: `Bearer xablau`,
          },
        },
      );

      expect(response.data.errors[0].code).to.equal(401);
      expect(response.data.errors[0].message).to.equal('você precisa estar autenticado para realizar essa ação');
    });

    it('A QUERY getUserById deve retorna um status code:401 e a mensagem: "você precisa estar autenticado para realizar essa ação" quando não encontrar um token valido no header.', async () => {
      const newUser = await userRepository.save(createUserMock());

      const response = await axios.post(
        URL,
        {
          query: findUserForIdQuery,
          variables: {
            getUserByIdId: newUser.id,
          },
        },
        {
          headers: {
            Authorization: `Bearer tokeninvalido`,
          },
        },
      );

      expect(response.data.errors[0].code).to.equal(401);
      expect(response.data.errors[0].message).to.equal('você precisa estar autenticado para realizar essa ação');
    });

    it('A QUERY getUserById deve retorna um usuário ao ser chamada com um id valido.', async () => {
      const newUser = await userRepository.save(createUserMock());

      const response: AxiosResponse<{ data: findForIdUserType }> = await axios.post(
        URL,
        {
          query: findUserForIdQuery,
          variables: {
            getUserByIdId: newUser.id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      expect(response.status).to.equal(200);
      expect(response.data.data.getUserById.id).to.be.deep.equal(newUser.id);
      expect(response.data.data.getUserById.name).to.be.deep.equal(newUser.name);
      expect(response.data.data.getUserById.email).to.be.deep.equal(newUser.email);
    });

    it('A QUERY getUserById deve retorna um status code: 404 e a mensagem: "Usuário não encontrado." ao ser chamada com um id invalido.', async () => {
      const response = await axios.post(
        URL,
        {
          query: findUserForIdQuery,
          variables: {
            getUserByIdId: 0,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      expect(response.data.errors[0].code).to.equal(404);
      expect(response.data.errors[0].message).to.equal('Usuário não encontrado.');
    });
  });
});
