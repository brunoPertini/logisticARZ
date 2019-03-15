import { Module } from '@nestjs/common';
import { MainOfficeService } from './main-office.service';
import { MainOfficeController } from './main-office.controller';
import { WarehouseService } from 'src/warehouse/warehouse.service';

@Module({
    imports: [WarehouseService],
    controllers: [MainOfficeController],
    providers: [MainOfficeService, WarehouseService]
})
export class MainOfficeModule {}
