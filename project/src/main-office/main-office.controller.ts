import { Controller, Get, Param } from '@nestjs/common';
import { MainOfficeService } from './main-office.service';
@Controller('main-office')
export class MainOfficeController {

    constructor(private readonly officeService: MainOfficeService) {}
    
    @Get()
    send_package() {
      return 'hello!';
    }

    @Get()
    package_state() {
      return 'hello!';
    }

    @Get('warehouse/state:id')
    warehouse_state(@Param('id') id) {
      return this.officeService.warehouse_state(id);  
    }
}
