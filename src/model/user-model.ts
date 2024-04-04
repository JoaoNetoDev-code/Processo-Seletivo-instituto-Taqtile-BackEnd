import { Field, ObjectType } from 'type-graphql';

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
}

@ObjectType()
export class LoginValid {
  @Field(() => UserModel)
  user: UserModel;

  @Field()
  token: string;
}
