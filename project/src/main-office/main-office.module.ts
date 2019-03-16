import { Module } from '@nestjs/common';
import { MainOfficeService } from './main-office.service';
import { MainOfficeController } from './main-office.controller';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import {Warehouse} from '../warehouse/warehouse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Warehouse])],
    controllers: [MainOfficeController],
    providers: [MainOfficeService, WarehouseService],
    exports: [MainOfficeService],
})
export class MainOfficeModule {}
