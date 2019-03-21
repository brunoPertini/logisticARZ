import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './warehouse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageService } from 'src/package/package.service';
import { CityService } from 'src/city/city.service';

@Module({
    imports: [TypeOrmModule.forFeature([Warehouse]), PackageService],
    providers: [WarehouseService, PackageService, CityService],
    exports: [WarehouseService],
  })
export class WarehouseModule {}
