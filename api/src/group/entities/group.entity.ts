import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Exclude() // Help needed, somehow not getting excluded.
  @Column() //@Column({ select: false })  Maybe i dunno...
  password: string;
}
