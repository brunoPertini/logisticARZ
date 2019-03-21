import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { City } from '../city/city.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { type } from 'os';

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  arrival_date: Date;

  @Column()
  delivered: boolean;

  @Column()
  city: string;

  @ManyToOne(type => Warehouse, warehouse => warehouse.packages)
  warehouse: Warehouse;
}