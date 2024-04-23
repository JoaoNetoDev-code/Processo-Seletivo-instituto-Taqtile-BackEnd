import { Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

@Resolver()
@Service()
export class Hello {
  @Query(() => String)
  async hello() {
    return 'Hello, world!';
  }
}
