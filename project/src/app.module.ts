import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainOfficeController } from './main-office/main-office.controller';

@Module({
  imports: [],
  controllers: [AppController, MainOfficeController],
  providers: [AppService],
})
export class AppModule {}
