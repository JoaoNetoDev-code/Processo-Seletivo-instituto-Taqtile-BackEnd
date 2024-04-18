import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../entity/user';
import { prefix } from '../../tests/mock-users/users-mock';

export const usersFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.name = faker.internet.userName();
  user.email = faker.internet.email();
  user.birthDate = faker.date.birthdate({ refDate: new Date() });
  user.password = faker.internet.password({ memorable: true, prefix, pattern: /[a-zA-Z0-9]+/ });

  return user;
});
