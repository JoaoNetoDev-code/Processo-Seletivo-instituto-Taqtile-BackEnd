import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateAddressInput {
  @Field()
  cep: string;

  @Field()
  street: string;

  @Field()
  streetNumber: number;

  @Field()
  complement: string;

  @Field()
  neighborhood: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  userId: number;
}
