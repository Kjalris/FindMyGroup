import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { Member } from '../../member/entities/member.entity';

@Entity()
export class Location {
  @OneToOne(() => Member, (member) => member.id, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  memberId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ type: 'point' })
  point: { x: number; y: number } | string;
}
