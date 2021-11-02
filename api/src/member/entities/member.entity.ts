import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Group } from '../../group/entities/group.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, (group) => group.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group_id: Group;

  @Column({ type: 'smallint' })
  role: number;

  @Column({ length: 255, unique: true })
  nickname: string;

  @Column()
  password: string;
}
