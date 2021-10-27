import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Area {
  @PrimaryColumn({ type: 'uuid' })
  group_id: string;

  @Column({ type: 'polygon' })
  area: string;
}
