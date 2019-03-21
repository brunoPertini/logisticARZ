import { Injectable, Inject } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { Warehouse } from '../warehouse/warehouse.entity';
import { City } from '../city/city.entity';

@Injectable()
export class CityService {

  private repository: Repository<City>;

  constructor(private readonly connection: Connection) {
    this.repository = connection.getRepository(City);
  }

 
  /**
   * Inserts a new city into database
   */
  create_city(cityName) {
    return this.repository
    .createQueryBuilder()
    .insert()
    .into(City)
    .values([new City(JSON.stringify(cityName))])
    .execute();
  }
}
