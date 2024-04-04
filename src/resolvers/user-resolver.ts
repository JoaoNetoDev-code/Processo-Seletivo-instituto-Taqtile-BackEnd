import { Resolver, Mutation, Query, Arg } from 'type-graphql';

import { appDataSource } from '../data-source';
import { UserModel } from '../model/user-model';
import { User } from '../entity/user';
import argonUtil from '../utils/argon-util';
import { CustomError } from '../exceptionsClass/exceptions-not-found-user';
import { CreateUserInput, UpdatedUserInput } from './inputs-validations/user-inputs-validations';

@Resolver()
export class UserResolver {
  users = appDataSource.getRepository(User);

  @Query(() => [UserModel])
  async getUsers() {
    return this.users.find();
  }

  @Mutation(() => UserModel)
  async createUser(@Arg('userData') userData: CreateUserInput): Promise<UserModel> {
    const userExists = await this.users.findOne({ where: { email: userData.email } });

    if (userExists) {
      throw new CustomError('Erro ao cadastrar novo usuário.', 400, 'Usuário já existe.');
    }

    const token = await argonUtil.signHashPassword(userData.password);

    return this.users.save({ ...userData, password: token });
  }

  @Mutation(() => String)
  async deleteUser(@Arg('id') id: number): Promise<string> {
    const userExists = await this.users.findOne({ where: { id } });

    if (!userExists) {
      throw new CustomError('Usuário não encontrado.', 400, 'Não foi possivel encontar o usuario solicitado.');
    }

    await this.users.remove(userExists);

    return 'Usuário removido com sucesso!';
  }

  @Mutation(() => UserModel)
  async updateUser(@Arg('id') id: number, @Arg('userData') userData: UpdatedUserInput): Promise<UserModel> {
    const userExists = await this.users.findOne({ where: { id } });
    const emailIsDuplicate = await this.users.findOne({ where: { email: userData.email } });

    if (!userExists) {
      throw new CustomError('Usuário não encontrado.', 400, 'Não foi possivel encontar o usuario solicitado.');
    }

    if (emailIsDuplicate && emailIsDuplicate.id !== userExists.id) {
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
