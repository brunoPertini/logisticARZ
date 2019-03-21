import { Injectable, Inject } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { Package } from './package.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { City } from '../city/city.entity';

@Injectable()
export class PackageService{

  private repository: Repository<Package>;

  constructor(private readonly connection: Connection) {
    this.repository = connection.getRepository(Package);
  }

 
  /**
   * Inserts a new package into database, associated with a warehouse.
   */
  async send_package_from_warehouse(city: string, warehouse: Warehouse) {
    await this.repository
    .createQueryBuilder()
    .insert()
    .into(Package)
    .values(
        [{
            arrival_date:new Date(),
            delivered:false,
            city:city,
            warehouse:warehouse,
        }]
    )
    .execute();
  }
}
