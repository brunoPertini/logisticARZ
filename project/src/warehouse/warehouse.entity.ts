import { Entity, Column, PrimaryColumn, OneToOne,JoinColumn,OneToMany } from 'typeorm';
import { City } from '../city/city.entity';
import { Package } from '../package/package.entity';

@Entity()
export class Warehouse {
  @PrimaryColumn()
  id: string;

  @OneToOne(type => City)
  @JoinColumn()
  city: City;

  @Column()
  cityName: string;

  /**
   * processing limit per warehouse
   */
  @Column()
  limit: number

  @Column()
  procesed_packages: number

  @OneToMany(type => Package, p => p.warehouse)
  packages: Package [];
}