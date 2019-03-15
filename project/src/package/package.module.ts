import { Module } from '@nestjs/common';
import { Package } from './package.entity';
import { PackageService } from './package.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Package])],
  providers: [PackageService],
})
export class PackageModule {

}
