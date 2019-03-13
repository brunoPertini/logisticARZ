import { Test, TestingModule } from '@nestjs/testing';
import { MainOfficeController } from './main-office.controller';

describe('MainOffice Controller', () => {
  let controller: MainOfficeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainOfficeController],
    }).compile();

    controller = module.get<MainOfficeController>(MainOfficeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
