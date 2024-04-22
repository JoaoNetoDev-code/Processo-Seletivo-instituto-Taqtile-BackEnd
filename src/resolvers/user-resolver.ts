import { UserModel, LoginValid } from './../model/user-model';
import { Resolver, Mutation, Query, Arg, Ctx } from 'type-graphql';

import { appDataSource } from '../data-source';
import { CustomError } from '../exceptionsClass/exceptions-not-found-user';
import { CreateUserInput, LoginUserInput, UpdatedUserInput } from './input-validation/user-input-validation';
import { User } from '../entity/user';

import argonUtil from '../utils/argon-util';
import jwtUtil from '../utils/jwt-util';
import { IMyContext } from '../types/type-context';

@Resolver()
export class UserResolver {
  users = appDataSource.getRepository(User);

  @Query(() => [UserModel])
  async getUsers(
    @Arg('page') page: number,
    @Arg('limit') limit: number,
    @Ctx() context: IMyContext,
  ): Promise<UserModel[]> {
    jwtUtil.verifyToken(context.token);

    const take = limit || 10;

    return this.users.find({
      take,
      skip: page * take,
      order: { name: 'ASC' },
    });
  }

  @Query(() => UserModel)
  async getUserById(@Arg('id') id: number, @Ctx() context: IMyContext): Promise<UserModel> {
    const user = await this.users.findOne({ where: { id } });

    jwtUtil.verifyToken(context.token);

    if (!user) {
      throw new CustomError('Usuário não encontrado.', 404, 'Não foi possível localizar o usuário.');
    }

    return user;
  }

  @Mutation(() => LoginValid)
  async login(@Arg('LoginUser') loginData: LoginUserInput): Promise<LoginValid> {
    const findUser = await this.users.findOne({ where: { email: loginData.email } });

    if (!findUser) {
      throw new CustomError(
        'Usuário ou senha inválidos.',
        401,
        'Não foi possível realizar login. Verifique suas credenciais e tente novamente.',
      );
    }

    const argonVerify = await argonUtil.verifyHashPassword(findUser.password, loginData.password);

    if (!argonVerify) {
      throw new CustomError(
        'Usuário ou senha inválidos.',
        401,
        'Não foi possível realizar login. Verifique suas credenciais e tente novamente.',
      );
    }

    const sessionToken = jwtUtil.signToken({ id: findUser.id, name: findUser.name }, loginData.rememberMe);

    return {
      user: findUser,
      token: sessionToken,
    };
  }

  @Mutation(() => UserModel)
  async createUser(@Arg('userData') userData: CreateUserInput, @Ctx() context: IMyContext): Promise<UserModel> {
    const userExists = await this.users.findOne({ where: { email: userData.email } });

    jwtUtil.verifyToken(context.token);

    if (userExists) {
      throw new CustomError('Erro ao cadastrar novo usuário.', 400, 'Usuário já existe.');
    }

    const hashPassword = await argonUtil.signHashPassword(userData.password);

    return this.users.save({ ...userData, password: hashPassword });
  }

  @Mutation(() => String)
  async deleteUser(@Arg('id') id: number, @Ctx() context: IMyContext): Promise<string> {
    jwtUtil.verifyToken(context.token);

    const userExists = await this.users.findOne({ where: { id } });

    if (!userExists) {
      throw new CustomError('Usuário não encontrado.', 400, 'Não foi possivel encontar o usuario solicitado.');
    }

    await this.users.remove(userExists);

    return 'Usuário removido com sucesso!';
  }

  @Mutation(() => UserModel)
  async updateUser(
    @Arg('id') id: number,
    @Arg('userData') userData: UpdatedUserInput,
    @Ctx() context: IMyContext,
  ): Promise<UserModel> {
    jwtUtil.verifyToken(context.token);

    const userExists = await this.users.findOne({ where: { id } });

    if (!userExists) {
      throw new CustomError('Usuário não encontrado.', 400, 'Não foi possivel encontar o usuario solicitado.');
    }

    const emailExists = await this.users.findOne({ where: { email: userData.email } });

    if (emailExists && userExists.id !== emailExists.id) {
      throw new CustomError(
        'O e-mail fornecido já está em uso por outro usuário.',
        400,
        'Por favor insira um email válido.',
      );
    }

    Object.assign(userExists, userData);

    if (userData.password) {
      userExists.password = await argonUtil.signHashPassword(userData.password);
    }

    return this.users.save(userExists);
  }
}
