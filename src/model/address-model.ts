import { Field, ObjectType } from 'type-graphql';
import { UserModel } from './user-model';

@ObjectType()
export class AddressModel {
  @Field()
  id: number;

  @Field()
  cep: number;

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

  @Field({ nullable: true })
  userId: number;

  @Field(() => UserModel, { nullable: true })
  user: UserModel;
}
