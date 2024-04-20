import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cep: number;

  @Column()
  street: string;

  @Column()
  streetNumber: number;

  @Column()
  complement: string;

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
