import { Module } from '@nestjs/common';
import { MainOfficeService } from './main-office.service';
import { MainOfficeController } from './main-office.controller';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import {Warehouse} from '../warehouse/warehouse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageService } from 'src/package/package.service';
import { CityService } from 'src/city/city.service';

@Module({
    imports: [TypeOrmModule.forFeature([Warehouse]), PackageService, CityService],
    controllers: [MainOfficeController],
    providers: [MainOfficeService, WarehouseService, PackageService, CityService],
    exports: [MainOfficeService],
})
export class MainOfficeModule {}
