import { Field, ObjectType } from 'type-graphql';
import { AddressModel } from './address-model';

@ObjectType()
export class UserModel {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  birthDate: Date;

  @Field(() => [AddressModel])
  addresses: AddressModel[];
}

@ObjectType()
export class LoginValid {
  @Field(() => UserModel)
  user: UserModel;

  @Field()
  token: string;
}
