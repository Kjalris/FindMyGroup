import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  group_id: string;

  @Column({ type: 'smallint' })
  role: number;

  @Column({ length: 255 })
  nickname: string;

  @Column()
  password: string;
}
