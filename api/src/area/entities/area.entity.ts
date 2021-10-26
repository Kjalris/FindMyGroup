import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Area {
  @PrimaryColumn({ type: 'uuid' })
  groupId: string;

  @Column({ type: 'polygon' })
  area: string;
}
