import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { User } from '../entity/user';
import { appDataSource } from '../data-source';
import { CustomError } from '../exceptionsClass/exceptions-not-found-user';
import { AddressModel } from '../model/address-model';
import { CreateAddressInput } from './input-validation/address-input-validation';
import { Address } from '../entity/address';
import { IMyContext } from '../types/type-context';
import jwtUtil from '../utils/jwt-util';

@Resolver()
export class AddressResolvers {
  userServer = appDataSource.getRepository(User);
  addressServer = appDataSource.getTreeRepository(Address);

  @Mutation(() => AddressModel)
  async createAddress(@Arg('address') address: CreateAddressInput, context: IMyContext): Promise<AddressModel> {
    jwtUtil.verifyToken(context.token);

    const user = await this.userServer.findOne({ where: { id: address.userId } });

    if (!user) {
      throw new CustomError('Usuário não encontrado.', 404, 'Não foi possível localizar o usuário.');
    }

    const addressCreated = await this.addressServer.save(address);

    user.addresses.push(addressCreated);

    await this.userServer.save(user);

    return { ...addressCreated, userId: user.id };
  }

  @Query(() => [AddressModel])
  async getAllAddress(
    @Arg('page') page: number,
    @Arg('limit') limit: number,
    context: IMyContext,
  ): Promise<AddressModel[]> {
    jwtUtil.verifyToken(context.token);

    const take = limit || 10;

    return this.addressServer.find({
      take,
      skip: page * take,
    });
  }

  @Query(() => [AddressModel])
  async getAllAddressInUser(@Arg('userId') userId: number, context: IMyContext): Promise<AddressModel[]> {
    jwtUtil.verifyToken(context.token);

    const user = await this.userServer.findOne({ where: { id: userId } });

    if (!user) {
      throw new CustomError('Usuário não encontrado.', 404, 'Não foi possível localizar o usuário.');
    }

    return user.addresses;
  }
}
