import { Field, InputType } from 'type-graphql';
import { IsEmail, IsOptional, Matches, MaxDate, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  @IsEmail({}, { message: 'Por favor, insira um endereço de e-mail válido.' })
  email: string;

  @Field()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: 'A senha deve ter no mínimo uma letra e um número.' })
  password: string;

  @Field()
  @MaxDate(() => new Date(), { message: 'Deve ser uma data presente ou passada.' })
  birthDate: Date;
}

@InputType()
export class UpdatedUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Por favor, insira um endereço de e-mail válido.' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: 'A senha deve ter no mínimo uma letra e um número.' })
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxDate(() => new Date(), { message: 'Deve ser uma data presente ou passada.' })
  birthDate?: Date;
}
