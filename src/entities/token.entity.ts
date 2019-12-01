import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'tokens' })
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column({ name: 'expired_at' })
  expiredAt: Date;

  @Column()
  ip: string;

  @Column({ name: 'user_agent' })
  userAgent: string;

  @ManyToOne(type => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
