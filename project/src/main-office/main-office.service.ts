import { Injectable } from '@nestjs/common';
import { WarehouseService } from '../warehouse/warehouse.service';

@Injectable()
export class MainOfficeService {

  constructor(private readonly warehouseService: WarehouseService) {}

  /**
   * 
   * @param id
   * @returns the percentage of procesed packages in the day
   */  
  warehouse_state(id:string) {
    return this.warehouseService.warehouse_state(id);  
  }
}