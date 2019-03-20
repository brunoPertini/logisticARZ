import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { City } from '../city/city.entity';
import { Warehouse } from '../warehouse/warehouse.entity';

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  arrival_date: Date;

  @Column()
  delivered: boolean;

  @OneToOne(type => City)
  @JoinColumn()
  destiny: City;

  @Column()
  destinyName: string;

  @Column()
  warehouseId: number;

  @ManyToOne(type => Warehouse, warehouse => warehouse.packages)
  warehouse: Warehouse;
}