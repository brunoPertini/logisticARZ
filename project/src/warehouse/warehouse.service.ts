import { Injectable, Dependencies } from "@nestjs/common";
import { Repository, Connection } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { PackageResponseDTO, PackageOnTimeSent, PackageDelayedSent } from "src/package/package_response.dto";
import { PackageService } from "src/package/package.service";
import { CityService } from "../city/city.service";
import { MainOfficeService } from "src/main-office/main-office.service";


@Injectable()
export class WarehouseService {

    //Used to compute the amount of days needed to send a package
    private static KILOMETERS_PER_DAY = 200;

    //Used to compute the price for sending a package
    private static KILOMETERS_PER_DOLAR = 5;

    private static LATE_PENALTY = 70;

    private repository: Repository<Warehouse>;

    constructor(private readonly connection: Connection,
                private readonly packageService: PackageService,
                private readonly cityService: CityService) {
        this.repository = connection.getRepository(Warehouse);
    }

    async warehouse_of_city(cityName:string) {
        return  this.repository.createQueryBuilder("warehouse")
               .where("warehouse.city = :name", { name: cityName })
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
            var percentage = (warehouse.procesed_packages*100)/warehouse.limit;
            console.log('percentage: '+ percentage);
            return percentage;
        } else {
            return 0;
        }
    }

    /**
     * 
     * @param id 
     * @returns if the warehouse is overloaded. 
     */
    async warehouse_overloaded(id:string) {
        return await this.warehouse_state(id) >= 100;
    }

    /**
     * @returns  all warehouses cities names
     */
    async warehouses_cities() {
        var cities = await this.repository
        .createQueryBuilder("w")
        .select("w.city")
        .getRawMany();
        return cities;
    }


    /**
     * Increments by one the procesed packages amount of the given warehouse
     * @param id
     */
    private async update_procesed_packages(id:string) {
        await this.connection
        .createQueryBuilder()
        .update(Warehouse)
        .set({procesed_packages: () => "procesed_packages + 1"})
        .where("id = :id", { id: id })
        .execute();
    }

    /**
     * It persists a new package to be sent from given warehouse city. If  warehouse is overloaded,
     * this function'll return a PackageDelayedSentDTO. If not, it'll return a PackageOnTimeSent.
     * @param warehouse_city : origin from where the package will be sent
     * @param distance: distance in km to the destiny
     */
    async perform_package_sending(warehouse_city: string, destiny: string, distance: number) {
        const warehouse = await this.warehouse_of_city(warehouse_city);
        var response: PackageResponseDTO;
        var percentage = await this.warehouse_state(warehouse.id);
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
        
        await this.packageService.send_package_from_warehouse(destiny,warehouse);
        await this.update_procesed_packages(warehouse.id);    
        

        this.warehouse_state(warehouse.id).then(percentage => {
            if(percentage >= 95) {
                console.log('TRIGGERING ALERT');
                MainOfficeService.changeStrategy(this);
            }
        })

        return response;
    }
}