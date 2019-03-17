import { Controller, Get, Post, Param, Dependencies, Body } from '@nestjs/common';
import { MainOfficeService } from './main-office.service';
import { PackageResponseDTO } from 'src/package/package_response.dto';
@Controller('main-office')
@Dependencies(MainOfficeService)
export class MainOfficeController {

    constructor(private readonly officeService: MainOfficeService) {
      this.officeService = officeService;
    }
    
    @Post()
    send_package_to_city(@Body()city: string): PackageResponseDTO {
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
