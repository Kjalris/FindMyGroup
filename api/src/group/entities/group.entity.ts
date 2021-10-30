import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
