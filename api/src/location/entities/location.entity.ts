import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { Member } from '../../member/entities/member.entity';

@Entity()
export class Location {
  @OneToOne(() => Member, (member) => member.id, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member_id: Member;

  @Column({ type: 'timestamp' })
  timestamp: string;

  @Column({ type: 'point' })
  point: string;
}
