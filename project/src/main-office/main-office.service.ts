import { Injectable, Dependencies } from '@nestjs/common';
import { WarehouseService } from '../warehouse/warehouse.service';

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
   * @returns the percentage of procesed packages in the day
   */  
  warehouse_state(id:string) {
    return this.warehouseService.warehouse_state(id);  
  }

  warehouses_cities() {
      return this.warehouseService.warehouses_cities();
  }

  /**
   * FIXME: as this is returning an empty array as result, despite inside matrix callback function the
   * result array has the expected data, this array will return mocked data.
   * @param cityName 
   * @returns a list of the closest warehouses to the given city, each one with it's distance. 
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
    //                         distance: sortedDistances[i]/1000
    //                     });
    
    //                     i = i + 1;
    //                 }
    //             });     
    //         }   
    //         return resultArray;
    //     }
    // });
    
    resultArray = [
        {"city":"Salta","distance":196.52},
        {"city":"San Miguel de Tucumán","distance":228.113},
        {"city":"Córdoba, Argentina","distance":705.759},
        {"city":"Santa Fe, Argentina","distance":950.308},
        {"city":"Mendoza","distance":1064.777},
        {"city":"Rosario","distance":1102.687},
        {"city":"Buenos Aires","distance":1393.983},
        {"city":"La Plata","distance":1451.995},
        {"city":"Mar del Plata","distance":1805.552},
        {"city":"Trelew","distance":2148.311}
    ];
    return resultArray;
  }
}