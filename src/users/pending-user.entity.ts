import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './user.entity';

@Entity('pending_users')
export class PendingUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role!: Role;

  @Column()
  otpHash!: string;

  @Column()
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
