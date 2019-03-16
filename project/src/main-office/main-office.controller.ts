import { Controller, Get, Param, Dependencies } from '@nestjs/common';
import { MainOfficeService } from './main-office.service';
@Controller('main-office')
@Dependencies(MainOfficeService)
export class MainOfficeController {

    constructor(private readonly officeService: MainOfficeService) {
      this.officeService = officeService;
    }
    
    @Get()
    send_package() {
      return 'hello!';
    }

    @Get('warehouse/distance/:cityName')
    closest_warehouse(@Param() params) {
      return this.officeService.closests_warehouses_for_city(params.cityName);
    }

    @Get('warehouse/state/:id')
    warehouse_overloaded(@Param() params) {
      return this.officeService.warehouse_overloaded(params.id);  
    }

    @Get('/warehouse/cities')
    warehouses_cities() {
      return this.officeService.warehouses_cities();
    }

}
