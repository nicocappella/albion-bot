import { Test, TestingModule } from '@nestjs/testing';
import { SiphonedEnergyController } from './siphoned-energy.controller';
import { SiphonedEnergyService } from './siphoned-energy.service';

describe('SiphonedEnergyController', () => {
  let controller: SiphonedEnergyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiphonedEnergyController],
      providers: [SiphonedEnergyService],
    }).compile();

    controller = module.get<SiphonedEnergyController>(SiphonedEnergyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
