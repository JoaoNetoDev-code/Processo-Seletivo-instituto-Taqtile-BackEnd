import { faker } from '@faker-js/faker/locale/pt_BR';

export const prefix = (Math.floor(Math.random() * 10) + 1).toString();

export const createUser = () => {
  return {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    birthDate: faker.date.birthdate({ refDate: new Date() }),
    password: faker.internet.password({ memorable: true, prefix, pattern: /[a-zA-Z0-9]+/ }),
  };
};

export const dateFuture = (daysFuture: number) => {
  const date = new Date();
  const dateInFuture = new Date(date.getTime() + daysFuture * 24 * 60 * 60 * 1000);
  return dateInFuture.toString();
};
