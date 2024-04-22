import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../entity/user';
import { Address } from '../entity/address';
import { faker } from '@faker-js/faker';

export default class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userFactory = factoryManager.get(User);
    const addressFactory = factoryManager.get(Address);

    const users = await userFactory.saveMany(50);

    const address = await Promise.all(
      Array(50)
        .fill('')
        .map(async () => {
          const made = await addressFactory.make({
            userId: faker.helpers.arrayElement(users).id,
          });
          return made;
        }),
    );
    for (const addr of address) {
      await addressFactory.save(addr);
    }
  }
}
