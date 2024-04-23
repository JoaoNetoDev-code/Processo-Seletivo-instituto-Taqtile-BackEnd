import { Service } from 'typedi';
import { appDataSource } from '../data-source';
import { User } from '../entity/user';
import { Address } from '../entity/address';
import { CreateAddressInput } from '../resolvers/input-validation/address-input-validation';
import { AddressModel } from '../model/address-model';
import { CustomError } from '../exceptionsClass/exceptions-not-found-user';

@Service()
export class AddressService {
  userServer = appDataSource.getRepository(User);
  addressServer = appDataSource.getRepository(Address);

  async createAddress(address: CreateAddressInput): Promise<AddressModel> {
    const user = await this.userServer.findOne({ where: { id: address.userId } });

    if (!user) {
      throw new CustomError('Usuário não encontrado.', 404, 'Não foi possível localizar o usuário.');
    }

    const addressCreated = await this.addressServer.save(address);

    user.addresses.push(addressCreated);

    await this.userServer.save(user);

    return { ...addressCreated, userId: user.id };
  }

  async getAllAddress(page: number, limit: number): Promise<AddressModel[]> {
    const take = limit || 10;

    return this.addressServer.find({
      take,
      skip: page * take,
    });
  }

  async getAllAddressInUser(userId: number): Promise<AddressModel[]> {
    const user = await this.userServer.findOne({ where: { id: userId } });

    if (!user) {
      throw new CustomError('Usuário não encontrado.', 404, 'Não foi possível localizar o usuário.');
    }

    return user.addresses;
  }
}
