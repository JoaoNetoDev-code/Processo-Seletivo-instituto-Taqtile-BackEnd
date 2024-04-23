import { Resolver, Mutation, Query, Arg, Ctx } from 'type-graphql';
import { Service } from 'typedi';

import { CreateUserInput, LoginUserInput, UpdatedUserInput } from './input-validation/user-input-validation';

import { UserService } from './../service/user-service';
import { UserModel, LoginValid } from './../model/user-model';
import { IMyContext } from '../types/type-context';
import jwtUtil from '../utils/jwt-util';

@Resolver()
@Service()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserModel])
  async getUsers(
    @Arg('page') page: number,
    @Arg('limit') limit: number,
    @Ctx() context: IMyContext,
  ): Promise<UserModel[]> {
    jwtUtil.verifyToken(context.token);

    return this.userService.getUsers(page, limit);
  }

  @Query(() => UserModel)
  async getUserById(@Arg('id') id: number, @Ctx() context: IMyContext): Promise<UserModel> {
    jwtUtil.verifyToken(context.token);

    return this.userService.getUserById(id);
  }

  @Mutation(() => LoginValid)
  async login(@Arg('LoginUser') loginData: LoginUserInput): Promise<LoginValid> {
    return this.userService.login(loginData);
  }

  @Mutation(() => UserModel)
  async createUser(@Arg('userData') userData: CreateUserInput, @Ctx() context: IMyContext): Promise<UserModel> {
    jwtUtil.verifyToken(context.token);

    return this.userService.createUser(userData);
  }

  @Mutation(() => String)
  async deleteUser(@Arg('id') id: number, @Ctx() context: IMyContext): Promise<string> {
    jwtUtil.verifyToken(context.token);

    return this.userService.deleteUser(id);
  }

  @Mutation(() => UserModel)
  async updateUser(
    @Arg('id') id: number,
    @Arg('userData') userData: UpdatedUserInput,
    @Ctx() context: IMyContext,
  ): Promise<UserModel> {
    jwtUtil.verifyToken(context.token);

    return this.userService.updateUser(id, userData);
  }
}
