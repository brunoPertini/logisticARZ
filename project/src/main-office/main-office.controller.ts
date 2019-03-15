import { Controller, Get } from '@nestjs/common';

@Controller('main-office')
export class MainOfficeController {

    
    @Get()
    send_package() {
      return 'hello!';
    }

    @Get()
    package_state() {
      return 'hello!';
    }

    @Get()
    warehouse_state() {
      return 'hello!';
    }
}
