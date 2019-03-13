import { Controller, Get } from '@nestjs/common';

@Controller('main-office')
export class MainOfficeController {
    @Get()
    findAll() {
      return 'hello!';
    }
}
