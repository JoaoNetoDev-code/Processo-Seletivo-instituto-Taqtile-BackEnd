import { Service } from 'typedi';
import { appDataSource } from '../data-source';
import { User } from '../entity/user';
import { LoginValid, UserModel } from '../model/user-model';
import { CustomError } from '../exceptionsClass/exceptions-not-found-user';
import { CreateUserInput, LoginUserInput, UpdatedUserInput } from '../resolvers/input-validation/user-input-validation';
import argonUtil from '../utils/argon-util';
import jwtUtil from '../utils/jwt-util';

@Service()
export class UserService {
  userRepository = appDataSource.getRepository(User);

  async login(loginData: LoginUserInput): Promise<LoginValid> {
    const findUser = await this.userRepository.findOne({ where: { email: loginData.email } });

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

  async getUsers(page: number, limit: number): Promise<UserModel[]> {
    const take = limit || 10;

    return this.userRepository.find({
      take,
      skip: page * take,
      order: { name: 'ASC' },
    });
  }

  async getUserById(id: number): Promise<UserModel> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new CustomError('Usuário não encontrado.', 404, 'Não foi possível localizar o usuário.');
    }

    return user;
  }

  async createUser(userData: CreateUserInput): Promise<UserModel> {
    const userExists = await this.userRepository.findOne({ where: { email: userData.email } });

    if (userExists) {
      throw new CustomError('Erro ao cadastrar novo usuário.', 400, 'Usuário já existe.');
    }

    const hashPassword = await argonUtil.signHashPassword(userData.password);

    return this.userRepository.save({ ...userData, password: hashPassword });
  }

  async deleteUser(id: number): Promise<string> {
    const userExists = await this.userRepository.findOne({ where: { id } });

    if (!userExists) {
      throw new CustomError('Usuário não encontrado.', 400, 'Não foi possivel encontar o usuario solicitado.');
    }

    await this.userRepository.remove(userExists);

    return 'Usuário removido com sucesso!';
  }

  async updateUser(id: number, userData: UpdatedUserInput): Promise<UserModel> {
    const userExists = await this.userRepository.findOne({ where: { id } });

    if (!userExists) {
      throw new CustomError('Usuário não encontrado.', 400, 'Não foi possivel encontar o usuario solicitado.');
    }

    const emailExists = await this.userRepository.findOne({ where: { email: userData.email } });

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

    return this.userRepository.save(userExists);
  }
}
