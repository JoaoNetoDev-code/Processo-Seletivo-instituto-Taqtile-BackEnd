import { AddressService } from '../service/address-service';
import { Resolver, Mutation, Arg, Query, Ctx } from 'type-graphql';
import { AddressModel } from '../model/address-model';
import { CreateAddressInput } from './input-validation/address-input-validation';
import { IMyContext } from '../types/type-context';
import jwtUtil from '../utils/jwt-util';
import { Service } from 'typedi';

@Service()
@Resolver()
export class AddressResolvers {
  constructor(private readonly addressService: AddressService) {}

  @Mutation(() => AddressModel)
  async createAddress(@Arg('address') address: CreateAddressInput, @Ctx() context: IMyContext): Promise<AddressModel> {
    jwtUtil.verifyToken(context.token);

    return this.addressService.createAddress(address);
  }

  @Query(() => [AddressModel])
  async getAllAddress(
    @Arg('page') page: number,
    @Arg('limit') limit: number,
    @Ctx() context: IMyContext,
  ): Promise<AddressModel[]> {
    jwtUtil.verifyToken(context.token);

    return this.addressService.getAllAddress(page, limit);
  }

  @Query(() => [AddressModel])
  async getAllAddressInUser(@Arg('userId') userId: number, @Ctx() context: IMyContext): Promise<AddressModel[]> {
    jwtUtil.verifyToken(context.token);

    return this.addressService.getAllAddressInUser(userId);
  }
}
