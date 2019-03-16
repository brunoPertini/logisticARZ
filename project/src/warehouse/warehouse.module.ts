import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './warehouse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Warehouse])],
    providers: [WarehouseService],
    exports: [WarehouseService],
  })
export class WarehouseModule {}
