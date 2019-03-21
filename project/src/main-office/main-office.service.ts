import { Injectable, Dependencies } from '@nestjs/common';
import { WarehouseService } from '../warehouse/warehouse.service';
import { strict } from 'assert';
import { OntimeStrategy, SendingStrategy, DelayedStrategy } from './main-office-strategy';
import { EventEmitter } from 'events';

const apiKey = "AIzaSyByN4uVJHXTirIP8d5qjJWFxgw1uygWAsw";


 //TODO: get this from database
const origins = ['Buenos Aires','Rosario', 'Córdoba, Argentina',
'Trelew', 'Mendoza', 'La Plata', 'San Miguel de Tucumán', 'Mar del Plata',
'Salta', 'Santa Fe, Argentina'];


const listener = function(message) {
  //TODO: choose a better approach to set strategy
  console.log('LIMIT REACHED: '+ message);
  if(this.sendingStrategy instanceof DelayedStrategy) {
    this.strategy(new OntimeStrategy(this.warehouseService));
  } else {
    this.strategy(new DelayedStrategy(this.warehouseService));  
  }    
}

@Injectable()
@Dependencies(WarehouseService)
export class MainOfficeService {

  private sendingStrategy: SendingStrategy;
  private limitAlert: EventEmitter;
  //Each warehouse city with it's distance to a certain destiny
  private warehouses: any;

  constructor(private readonly warehouseService: WarehouseService) {
      this.warehouseService = warehouseService;
      this.sendingStrategy = new OntimeStrategy(warehouseService);
      this.limitAlert = new EventEmitter();
      this.limitAlert.addListener('limitReached', listener);
  }

  

  strategy(newStrategy: SendingStrategy) {
    this.sendingStrategy = newStrategy;
  }

  /**
   * 
   * @param id
   * @returns if the percentage of procesed packages is greater or equal than 0.95
   */  
  warehouse_overloaded(id:string) {
    return this.warehouseService.warehouse_state(id). then (result => {
        return result >=100;
    });  
  }

  warehouses_cities() {
      return this.warehouseService.warehouses_cities();
  }

  
   /**
   * FIXME: as this is returning an empty array as result, despite inside matrix callback function the
   * result array has the expected data, this array will return mocked data.
   * @param cityName 
   * @returns a list of the closest warehouses cities to the given city, each one with it's distance in kilometers.
   */
  async closests_warehouses_for_city(cityName:string){
    const googleMapsClient = require('@google/maps').createClient({
      key: apiKey,
    });

    // return await googleMapsClient.distanceMatrix({origins: origins,destinations: [cityName]},
    //   function(err,distances) {
    //     var auxArray = [];
    //     var sortedDistances = [];
    //     var resultArray=[];
    //     var results;

    //     //If no error, for each origin it's distance to the destiny is stored in auxArray
    //     results = distances['json']['rows'].map(d => d['elements']);
    //     var mappedDistances = results.map(r=>r[0]['distance']);
    //     for(var i=0;i<origins.length;++i){
    //         auxArray[origins[i]] = mappedDistances[i]['value']; 
    //         sortedDistances.push(mappedDistances[i]['value']);
    //     }

    //     //Once all distances are taken, they're sorted ascending, and finally associated to it's city
    //     sortedDistances.sort(function(a, b){return a-b});
    //     var i = 0;
    //     while (i < 10) {
    //         Object.keys(auxArray).forEach(key => {
    //             if(auxArray[key] == sortedDistances[i]) {    
    //                 resultArray.push( {
    //                     city: key,
    //                     distance: Math.floor(sortedDistances[i]/1000)
    //                 });

    //                 i = i + 1;
    //             }
    //         });     
    //     }   
    //     //console.log('INSIDE FUNCTION: '+JSON.stringify(resultArray));
    //     return resultArray;  
    //   });
     
    var resultArray = [
        {cityName:"Salta",distance:196},
        {cityName:"San Miguel de Tucumán",distance:228},
        {cityName:"Córdoba",distance:705.},
        {cityName:"Santa Fe",distance:950},
        {cityName:"Mendoza",distance:1064},
        {cityName:"Rosario",distance:1102},
        {cityName:"Buenos Aires",distance:1393},
        {cityName:"La Plata",distance:1451},
        {cityName:"Mar del Plata",distance:1805},
        {cityName:"Trelew",distance:2148}
    ];

    return resultArray;
  }


  async send_package_to_city(destiny: string) {
    var warehousesCities = await this.closests_warehouses_for_city(destiny);
    return this.sendingStrategy.send_package_from_nearest(warehousesCities,destiny);
  }
}