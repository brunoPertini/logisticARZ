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

export const apiKey = "AIzaSyByN4uVJHXTirIP8d5qjJWFxgw1uygWAsw";

@Module({
  imports: [TypeOrmModule.forRoot(), PackageModule, CityModule, WarehouseModule,],
  controllers: [AppController, MainOfficeController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {
    //Initial data of cities and warehouses
    const queryBuilder = connection.createQueryBuilder();
    queryBuilder
    .insert()
    .into(City)
    .values([
        { name:"Buenos Aires" }, 
        {  name:"Rosario" },
        {  name:"Córdoba" },
        {  name:"Trelew" },
        {  name:"Mendoza" },
        {  name:"La Plata" },
        {  name:"San Miguel de Tucumán" },
        {  name:"Mar del Plata" },
        {  name:"Salta" },
        {  name:"Santa Fe" }
     ])
    .execute();

     queryBuilder
     .insert()
     .into(Warehouse)
     .values(
       [
         {id:"WH01", city: new City("Buenos Aires"), limit:200},
         {id:"WH02", city: new City("Rosario"), limit:70},
         {id:"WH03", city: new City("Córdoba"), limit:150},
         {id:"WH04", city: new City("Trelew"), limit:140},
         {id:"WH05", city: new City("Mendoza"), limit:150},
         {id:"WH06", city: new City("La Plata"), limit:100},
         {id:"WH07", city: new City("San Miguel de Tucumán"), limit:120},
         {id:"WH08", city: new City("Mar del Plata"), limit:180},
         {id:"WH09", city: new City("Salta"), limit:140},
         {id:"WH10", city: new City("Santa Fe"), limit:70},
       ]
     )
     .execute();
  }
}
