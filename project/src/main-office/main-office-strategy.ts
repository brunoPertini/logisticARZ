import { PackageResponseDTO } from '../package/package_response.dto';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { async } from 'rxjs/internal/scheduler/async';

/**
 * Main office's strategy to send packages to customers, from warehouses.
 * Strategy 1 (default one): send the package to the fisrt nearest not 
 * overloaded warehouse. Strategy 2: send the package to the nearest warehouse
 * , which will return if it has to pay a late penalty or not.  
 */
export abstract class SendingStrategy {
    constructor(protected warehouseService: WarehouseService) {  
        this.warehouseService = warehouseService;    
    }

    /**
     * 
     * @param warehouses closest warehouses cities to the destiny with their distance
     * @param destiny destiny city name
     */
    abstract async send_package_from_nearest(warehouses, destiny: string);
}


/**
 * At this implementation, package will be sent to the nearest warehouse, no mather if
 * it is overloaded.
 */
export class DelayedStrategy extends SendingStrategy {
    async send_package_from_nearest(warehouses: Array<any>, destiny: string) {
        return await this.warehouseService.perform_package_sending(warehouses[0].cityName,destiny,
            warehouses[0].distance);   
    }
}


/**
 * At this implementation, package will be sent from the first nearest not overloaded warehouse. 
 */
export class OntimeStrategy extends SendingStrategy {
    /**
     * Receives an array of warehouses cities and returns those that are not overloaded
     */
    private async  getNotOverloaded(warehouses: Array<any>) {
        var notOverloaded = [];
        
        for(var i=0; i< warehouses.length;++i) {
            var warehouse = await this.warehouseService.warehouse_of_city(warehouses[i].cityName);
            var overloaded = await this.warehouseService.warehouse_overloaded(warehouse.id);
            if(!overloaded) {
                notOverloaded.push(warehouses[i]);        
            }         
        }
        return notOverloaded;    
    }

    async send_package_from_nearest(warehouses: Array<any>, destiny: string) {       
        var notOverloaded = await this.getNotOverloaded(warehouses);

        console.log('NOT OVERLOADED: '+ JSON.stringify(notOverloaded));
        if(!!notOverloaded[0]) {
            return await this.warehouseService.perform_package_sending(notOverloaded[0].cityName,
                destiny,notOverloaded[0].distance);    
        } else {
            console.log('RETURNING NULL');
            return null;
        }
    }    
}