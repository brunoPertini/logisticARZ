import { Injectable, Dependencies } from "@nestjs/common";
import { Repository, Connection } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Package } from '../package/package.entity';
import { City } from "src/city/city.entity";


@Injectable()
export class WarehouseService {

    //Used to compute the amount of days needed to send a package
    private static KILOMETERS_PER_DAY = 200;

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

    /**
     * Inserts a new package into database, associated with a warehouse.
     */
    async send_package_from_warehouse(destiny: City, warehouse: Warehouse) {
        await this.repository
        .createQueryBuilder()
        .insert()
        .into(Package)
        .values(
           [{
               arrival_date:new Date(),
               delivered:false,
               destiny:destiny,
               warehouse:warehouse
            }]
        )
        .execute();
    }
}