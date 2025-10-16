import { Test, TestingModule } from '@nestjs/testing';
import { SiphonedEnergyService } from './siphoned-energy.service';

describe('SiphonedEnergyService', () => {
  let service: SiphonedEnergyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SiphonedEnergyService],
    }).compile();

    service = module.get<SiphonedEnergyService>(SiphonedEnergyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
