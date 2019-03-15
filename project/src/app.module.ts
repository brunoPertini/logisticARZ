import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainOfficeController } from './main-office/main-office.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { PackageModule } from './package/package.module';
import { CityModule } from './city/city.module';
import { Warehouse } from "../src/warehouse/warehouse.entity";
import { City } from "../src/city/city.entity";
import { WarehouseModule } from './warehouse/warehouse.module';

@Module({
  imports: [TypeOrmModule.forRoot(), PackageModule, CityModule, WarehouseModule,],
  controllers: [AppController, MainOfficeController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {
    //Initial data of warehouses
    const queryBuilder = connection.createQueryBuilder();
    queryBuilder
    .insert()
    .into(City)
    .values([
        { name:"Buenos Aires", coordinates: "fdff" }, 
        {  name:"Rosario", coordinates:"fdf"}
     ])
    .execute();
  }
}
