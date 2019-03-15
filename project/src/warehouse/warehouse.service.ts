import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { WarehouseRepository } from "./warehouse.repository";

@Injectable()
export class WarehouseService {

    constructor(@InjectRepository(Warehouse)
    private readonly repository: Repository<Warehouse>) {}

    /**
     * 
     * @param id
     * @returns the percentage of procesed packages in the day
    */  
    async warehouse_state(id:string) {
        const warehouse = await this.repository.findOne({id:id});
        if(warehouse) {
            return warehouse.procesed_packages/warehouse.limit;
        } else {
            return 0;
        }
    }
}