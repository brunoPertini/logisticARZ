import { Injectable, Dependencies } from "@nestjs/common";
import { Repository, Connection } from 'typeorm';
import { Warehouse } from './warehouse.entity';


@Injectable()
export class WarehouseService {

    private repository: Repository<Warehouse>;

    constructor(private readonly connection: Connection) {
        this.repository = connection.getRepository(Warehouse);
    }

    /**
     * 
     * @param id
     * @returns the percentage of procesed packages in the day
    */  
    async warehouse_state(id:string) {
        const warehouse = await this.repository.findOne(id);
        if(warehouse) {
            return warehouse.procesed_packages/warehouse.limit;
        } else {
            return 0;
        }
    }

    /**
     * @returns  all warehouses cities names
     */
    async warehouses_cities() {
        var cities = await this.repository
        .createQueryBuilder("w")
        .select("w.cityName")
        .getRawMany();
        return cities;
    }
}