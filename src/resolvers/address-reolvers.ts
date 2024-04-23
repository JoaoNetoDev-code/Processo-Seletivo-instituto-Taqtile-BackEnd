import { AddressService } from './../service/address-service';
import { Resolver, Mutation, Arg, Query, Ctx } from 'type-graphql';
import { AddressModel } from '../model/address-model';
import { CreateAddressInput } from './input-validation/address-input-validation';
import { IMyContext } from '../types/type-context';
import jwtUtil from '../utils/jwt-util';
import Container, { Service } from 'typedi';

@Service()
@Resolver()
export class AddressResolvers {
  private AddressService: AddressService;

  constructor() {
    this.AddressService = Container.get(AddressService);
  }

  @Mutation(() => AddressModel)
  async createAddress(@Arg('address') address: CreateAddressInput, @Ctx() context: IMyContext): Promise<AddressModel> {
    jwtUtil.verifyToken(context.token);

    return this.AddressService.createAddress(address);
  }

  @Query(() => [AddressModel])
  async getAllAddress(
    @Arg('page') page: number,
    @Arg('limit') limit: number,
    @Ctx() context: IMyContext,
  ): Promise<AddressModel[]> {
    jwtUtil.verifyToken(context.token);

    return this.AddressService.getAllAddress(page, limit);
  }

  @Query(() => [AddressModel])
  async getAllAddressInUser(@Arg('userId') userId: number, @Ctx() context: IMyContext): Promise<AddressModel[]> {
    jwtUtil.verifyToken(context.token);

    return this.AddressService.getAllAddressInUser(userId);
  }
}
