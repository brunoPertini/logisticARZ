import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './warehouse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseRepository } from './warehouse.repository'

@Module({
    imports: [TypeOrmModule.forFeature([Warehouse])],
    providers: [WarehouseService],
})
export class WarehouseModule {}
