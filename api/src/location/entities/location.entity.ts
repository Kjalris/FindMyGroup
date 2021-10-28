import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryColumn({ type: 'uuid' })
  member_id: string;

  @Column({ type: 'timestamp' })
  timestamp: string;

  @Column({ type: 'point' })
  point: string;
}
