import { Injectable, Dependencies } from "@nestjs/common";
import { Repository, Connection } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Package } from '../package/package.entity';
import { City } from "src/city/city.entity";
import { PackageResponseDTO, PackageOnTimeSent, PackageDelayedSent } from "src/package/package_response.dto";


@Injectable()
export class WarehouseService {

    //Used to compute the amount of days needed to send a package
    private static KILOMETERS_PER_DAY = 200;

    //Used to compute the price for sending a package
    private static KILOMETERS_PER_DOLAR = 5;

    private static LATE_PENALTY = 70;

    private repository: Repository<Warehouse>;

    constructor(private readonly connection: Connection) {
        this.repository = connection.getRepository(Warehouse);
    }

    async warehouse_of_city(cityName:string) {
        return  this.repository.createQueryBuilder("warehouse")
               .where("warehouse.city.name = :name", { name: cityName })
               .getOne();
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
    private async send_package_from_warehouse(destiny: string, warehouse: Warehouse) {
        await this.repository
        .createQueryBuilder()
        .insert()
        .into(Package)
        .values(
           [{
               arrival_date:new Date(),
               delivered:false,
               destiny: new City(destiny),
               warehouse:warehouse
            }]
        )
        .execute();
    }

    /**
     * It persists a new package to be sent from given warehouse city. If  warehouse is overloaded,
     * this function'll return a PackageDelayedSentDTO. If not, it'll return a PackageOnTimeSent.
     * @param warehouse_city : origin from wherem the package will be sent
     * @param distance: distance in km to the destiny
     */
    async perform_package_sending(warehouse_city: string, destiny: string, distance: number) {
        const warehouse = await this.warehouse_of_city(warehouse_city);
        var response: PackageResponseDTO;
        this.warehouse_state(warehouse.id).then(percentage => {
            //delivered_date computing
            var delivered_date = new Date();
            var added_days = Math.floor(distance/WarehouseService.KILOMETERS_PER_DAY);
            delivered_date.setDate(delivered_date.getDate()+added_days);

            if(percentage < 100) {
                var price = Math.floor(distance/WarehouseService.KILOMETERS_PER_DOLAR);
                response = new PackageOnTimeSent(delivered_date,price);
            } else {
                //Overloaded warehouse, delivered date is delayed 1 day
                delivered_date.setDate(delivered_date.getDate()+1);
                response = new PackageDelayedSent(delivered_date,WarehouseService.LATE_PENALTY);

            }
            
            this.send_package_from_warehouse(destiny,warehouse);
        });

        return response;
    }
}