import { Injectable, Dependencies } from '@nestjs/common';
import { WarehouseService } from '../warehouse/warehouse.service';
import { OntimeStrategy, SendingStrategy, DelayedStrategy } from './main-office-strategy';

const apiKey = "AIzaSyByN4uVJHXTirIP8d5qjJWFxgw1uygWAsw";


 //TODO: get this from database
const origins = ['Buenos Aires','Rosario', 'Córdoba, Argentina',
'Trelew', 'Mendoza', 'La Plata', 'San Miguel de Tucumán', 'Mar del Plata',
'Salta', 'Santa Fe, Argentina'];

@Injectable()
@Dependencies(WarehouseService)
export class MainOfficeService {

  private static sendingStrategy;

  constructor(private readonly warehouseService: WarehouseService) {
      this.warehouseService = warehouseService;
      MainOfficeService.sendingStrategy= new OntimeStrategy(warehouseService);
  }

  
  strategy(newStrategy: SendingStrategy) {
    MainOfficeService.sendingStrategy = newStrategy;
  }

   
  async warehouse_overloaded(id:string) {
    return await this.warehouseService.warehouse_overloaded(id);
  }

  warehouses_cities() {
      return this.warehouseService.warehouses_cities();
  }

  googleApiDistances(cityName:string) {
    const googleMapsClient = require('@google/maps').createClient({
      key: apiKey,
    });

    return new Promise(function(resolve,reject) {
      googleMapsClient.distanceMatrix({origins: origins,destinations: [cityName]},
        function(err,distances) {
          if(!!err) reject(err);
          
          resolve(distances);
        }  
      )
    });
  }

  
  /**
 * @param cityName 
 * @returns a list of the closest warehouses cities to the given city, each one with it's distance in kilometers.
 */
  async closests_warehouses_for_city(cityName:string){
    var auxArray = [];
    var sortedDistances = [];
    var resultArray=[];
    var results;

    var distances = await this.googleApiDistances(cityName);   

    //If no error, for each origin it's distance to the destiny is stored in auxArray
    results = distances['json']['rows'].map(d => d['elements']);
    var mappedDistances = results.map(r=>r[0]['distance']);
    mappedDistances = mappedDistances.filter(d => !!d);

    for(var i=0;i<mappedDistances.length;++i){
        console.log(mappedDistances[i]);
          auxArray[origins[i]] = mappedDistances[i]['value']; 
          sortedDistances.push(mappedDistances[i]['value']);  
    }

    //Once all distances are taken, they're sorted ascending, and finally associated to it's city
    sortedDistances.sort(function(a, b){return a-b});
    var i = 0;
    while (i < mappedDistances.length) {
        Object.keys(auxArray).forEach(key => {
            if(auxArray[key] == sortedDistances[i]) {    
                resultArray.push( {
                    city: key,
                    distance: Math.floor(sortedDistances[i]/1000)
                });

                i = i + 1;
            }
        });     
    }  
    return resultArray;
  }  
     
  async send_package_to_city(destiny: string) {
    var warehousesCities = await this.closests_warehouses_for_city(destiny);
    return await MainOfficeService.sendingStrategy.send_package_from_nearest(warehousesCities,destiny);
  }

  /**
   * Just makes a swap between the two strategies. Note: before I tried to
   * use an event emitter, and then just relations between office service and
   * warehouse service, but I  could never make it work like that.
   */
  static changeStrategy(warehouseService: WarehouseService) {
    console.log('LIMIT REACHED');
    if(MainOfficeService.sendingStrategy instanceof DelayedStrategy) {
      MainOfficeService.sendingStrategy = new OntimeStrategy(warehouseService);
    } else {
      MainOfficeService.sendingStrategy = new DelayedStrategy(warehouseService);  
    }      
  }
}