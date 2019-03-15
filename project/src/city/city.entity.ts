import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class City {
  @PrimaryColumn()
  name: string;

  @Column()
  coordinates: string;
}