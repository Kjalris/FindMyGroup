import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Group } from '../../group/entities/group.entity';

export enum MemberRoleEnum {
  'OWNER' = 0,
  'MEMBER' = 1,
}

@Entity()
@Unique('unique', ['groupId', 'nickname'])
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, (group) => group.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groupId' })
  groupId: string;

  @Column({ type: 'enum', enum: MemberRoleEnum })
  role: MemberRoleEnum;

  @Column({ length: 255 })
  nickname: string;

  @Column({
    select: false,
  })
  password: string;
}
