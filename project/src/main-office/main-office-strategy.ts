import { PackageResponseDTO } from '../package/package_response.dto';
import { WarehouseService } from 'src/warehouse/warehouse.service';

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
    abstract send_package_from_nearest(warehouses, destiny: string)
    : PackageResponseDTO;
}


/**
 * At this implementation, package will be sent to the nearest warehouse, no mather if
 * it is overloaded.
 */
export class DelayedStrategy extends SendingStrategy {
    send_package_from_nearest(warehouses: Array<any>, destiny: string) 
    : PackageResponseDTO{
        return this.warehouseService.perform_package_sending(warehouses[0].cityName,destiny,
            warehouses[0].distance);   
    }
}


/**
 * At this implementation, package will be sent from the first nearest not overloaded warehouse. 
 */
export class OntimeStrategy extends SendingStrategy {
    send_package_from_nearest(warehouses: Array<any>, destiny: string) 
    : PackageResponseDTO{
        warehouses.forEach(w => {
            this.warehouseService.warehouse_of_city(w).then (warehouse => {
                var overloaded = this.warehouseService.warehouse_overloaded(warehouse.id);
                if(!overloaded) {
                    return this.warehouseService.perform_package_sending(w.cityName,
                        destiny,w.distance);
                }   
            });
        });         
        return null
    }    
}