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
   * @returns a list of the closest warehouses cities to the given city.
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
    
    resultArray = ["Salta","San Miguel de Tucumán","Córdoba, Argentina",
        "Santa Fe, Argentina", "Mendoza","Rosario","Buenos Aires",
        "La Plata","Mar del Plata","Trelew"];
    return resultArray;
  }
}