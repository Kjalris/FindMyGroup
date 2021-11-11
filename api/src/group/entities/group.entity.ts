import { Member } from 'src/member/entities/member.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'polygon' })
  area: string;

  @Column({ length: 255 })
  name: string;

  @Column()
  password: string;

  @OneToMany(() => Member, (member) => member.groupId)
  members: Member[];
}
