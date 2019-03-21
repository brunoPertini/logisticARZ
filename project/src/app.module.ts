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
import { MainOfficeModule } from './main-office/main-office.module';
import { Package } from './package/package.entity';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type: 'mysql',
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "logistic",
      entities: ["src/**/**.entity{.ts,.js}"],
      synchronize: true,
      logging: false,
    }
  ), WarehouseModule, PackageModule, CityModule,
            MainOfficeModule],
  controllers: [AppController, MainOfficeController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {
    // //Initial data of cities and warehouses
    const queryBuilder = connection.createQueryBuilder();  
    var cities = this.initializeCities(connection);

     queryBuilder
     .insert()
     .into(Warehouse)
     .values(
       [
         {id:"WH01", city: cities[0], limit:200},
         {id:"WH02", city: cities[1], limit:70},
         {id:"WH03", city: cities[2], limit:150},
         {id:"WH04", city: cities[3], limit:140},
         {id:"WH05", city: cities[4], limit:150},
         {id:"WH06", city: cities[5], limit:100},
         {id:"WH07", city: cities[6], limit:120},
         {id:"WH08", city: cities[7], limit:180},
         {id:"WH09", city: cities[8], limit:140},
         {id:"WH10", city: cities[9], limit:70},
       ]
     )
     .execute();
  }

   private initializeCities(connection: Connection) {
    const queryBuilder = connection.createQueryBuilder();
    var cities = [];
    cities.push(new City("Buenos Aires"));
    cities.push(new City("Rosario"));
    cities.push(new City("Córdoba"));
    cities.push(new City("Trelew"));
    cities.push(new City("Mendoza"));
    cities.push(new City("La Plata"));
    cities.push(new City("San Miguel de Tucumán"));
    cities.push(new City("Mar del Plata"));
    cities.push(new City("Salta"));
    cities.push(new City("Santa Fe"));
    queryBuilder.insert().into(City).values(cities).execute();
    return cities;  
  }
}
