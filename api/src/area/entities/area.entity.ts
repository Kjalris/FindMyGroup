import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { Group } from '../../group/entities/group.entity';

@Entity()
export class Area {
  @OneToOne(() => Group, (group) => group.id, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group_id: Group;

  @Column({ type: 'polygon' })
  area: string;
}
