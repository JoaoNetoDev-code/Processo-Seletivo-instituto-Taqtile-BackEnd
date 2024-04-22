import { faker } from '@faker-js/faker';

export const createAddressMock = (id: number) => {
  return {
    cep: faker.location.zipCode(),
    street: faker.location.city(),
    streetNumber: faker.number.int({ max: 100 }),
    complement: faker.lorem.lines(),
    neighborhood: faker.location.country(),
    city: faker.location.city(),
    state: faker.location.state(),
    userId: id,
  };
};
