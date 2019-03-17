import { Injectable, Dependencies } from '@nestjs/common';
import { WarehouseService } from '../warehouse/warehouse.service';
import { strict } from 'assert';

const apiKey = "AIzaSyByN4uVJHXTirIP8d5qjJWFxgw1uygWAsw";

@Injectable()
@Dependencies(WarehouseService)
export class MainOfficeService {

    

  constructor(private readonly warehouseService: WarehouseService) {
      this.warehouseService = warehouseService;
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
  async closests_warehouses_for_city(cityName:string) {
    var distance = require('google-distance-matrix');
    //TODO: get this from database 
    var origins = ['Buenos Aires','Rosario', 'Córdoba, Argentina',
    'Trelew', 'Mendoza', 'La Plata', 'San Miguel de Tucumán', 'Mar del Plata',
    'Salta', 'Santa Fe, Argentina'];

    distance.key(apiKey);
    var auxArray = [];
    var sortedDistances = [];
    var resultArray=[];
    var results;

    // distance.matrix(origins, [cityName] , function (err, distances) {
    //     if (!err) {
    //         //If no error, for each origin it's distance to the destiny is stored in auxArray
    //         results = distances['rows'].map(d => d['elements']);
    //         var mappedDistances = results.map(r=>r[0]['distance']);
    //         for(var i=0;i<origins.length;++i){
    //             auxArray[origins[i]] = mappedDistances[i]['value']; 
    //             sortedDistances.push(mappedDistances[i]['value']);
    //         }
    
    //         //Once all distances are taken, they're sorted ascending, and finally associated to it's city
    //         sortedDistances.sort(function(a, b){return a-b});
    //         var i = 0;
    //         while (i < 10) {
    //             Object.keys(auxArray).forEach(key => {
    //                 if(auxArray[key] == sortedDistances[i]) {
    //                     //console.log('key: '+ key+' , distance: '+ sortedDistances[i]);
    
    //                     resultArray.push( {
    //                         city: key,
    //                         distance: Math.floor(sortedDistances[i]/1000)
    //                     });
    
    //                     i = i + 1;
    //                 }
    //             });     
    //         }   
    //         return resultArray;
    //     }
    // });
    
    resultArray = [
        {"city":"Salta","distance":196},
        {"city":"San Miguel de Tucumán","distance":228},
        {"city":"Córdoba, Argentina","distance":705.},
        {"city":"Santa Fe, Argentina","distance":950},
        {"city":"Mendoza","distance":1064},
        {"city":"Rosario","distance":1102},
        {"city":"Buenos Aires","distance":1393},
        {"city":"La Plata","distance":1451},
        {"city":"Mar del Plata","distance":1805},
        {"city":"Trelew","distance":2148}
    ];
    return resultArray;
  }

  async send_package_to_city(cityName: string) {
    var cities = await this.closests_warehouses_for_city(cityName);


  }
}