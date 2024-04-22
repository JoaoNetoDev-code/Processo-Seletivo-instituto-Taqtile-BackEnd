import { setSeederFactory } from 'typeorm-extension';
import { Address } from '../../entity/address';
import { Faker } from '@faker-js/faker';

export const addressFactory = setSeederFactory(Address, (faker: Faker) => {
  const address = new Address();

  address.cep = faker.location.zipCode();
  address.street = faker.location.city();
  address.streetNumber = faker.number.int({ max: 100 });
  address.complement = faker.lorem.lines();
  address.neighborhood = faker.location.country();
  address.city = faker.location.city();
  address.state = faker.location.state();
  return address;
});
