import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { User } from '../entity/user';
import { appDataSource } from '../data-source';
import { CustomError } from '../exceptionsClass/exceptions-not-found-user';
import { AddressModel } from '../model/address-model';
import { CreateAddressInput } from './input-validation/address-input-validation';
import { Address } from '../entity/address';

@Resolver()
export class AddressResolvers {
  userServer = appDataSource.getRepository(User);
  addressServer = appDataSource.getTreeRepository(Address);

  @Mutation(() => AddressModel)
  async createAddress(@Arg('address') address: CreateAddressInput): Promise<AddressModel> {
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
  async getAllAddress(): Promise<AddressModel[]> {
    return this.addressServer.find();
  }
}
