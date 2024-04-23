import { Resolver, Mutation, Query, Arg, Ctx } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { CreateUserInput, LoginUserInput, UpdatedUserInput } from './input-validation/user-input-validation';

import { UserService } from './../service/user-service';
import { UserModel, LoginValid } from './../model/user-model';
import { IMyContext } from '../types/type-context';
import jwtUtil from '../utils/jwt-util';

@Resolver()
@Service()
export class UserResolver {
  private readonly UserService: UserService;

  constructor(@Inject() UserService: UserService) {
    this.UserService = UserService;
  }

  @Query(() => [UserModel])
  async getUsers(
    @Arg('page') page: number,
    @Arg('limit') limit: number,
    @Ctx() context: IMyContext,
  ): Promise<UserModel[]> {
    jwtUtil.verifyToken(context.token);

    return this.UserService.getUsers(page, limit);
  }

  @Query(() => UserModel)
  async getUserById(@Arg('id') id: number, @Ctx() context: IMyContext): Promise<UserModel> {
    jwtUtil.verifyToken(context.token);

    return this.UserService.getUserById(id);
  }

  @Mutation(() => LoginValid)
  async login(@Arg('LoginUser') loginData: LoginUserInput): Promise<LoginValid> {
    return this.UserService.login(loginData);
  }

  @Mutation(() => UserModel)
  async createUser(@Arg('userData') userData: CreateUserInput, @Ctx() context: IMyContext): Promise<UserModel> {
    jwtUtil.verifyToken(context.token);

    return this.UserService.createUser(userData);
  }

  @Mutation(() => String)
  async deleteUser(@Arg('id') id: number, @Ctx() context: IMyContext): Promise<string> {
    jwtUtil.verifyToken(context.token);

    return this.UserService.deleteUser(id);
  }

  @Mutation(() => UserModel)
  async updateUser(
    @Arg('id') id: number,
    @Arg('userData') userData: UpdatedUserInput,
    @Ctx() context: IMyContext,
  ): Promise<UserModel> {
    jwtUtil.verifyToken(context.token);

    return this.UserService.updateUser(id, userData);
  }
}
