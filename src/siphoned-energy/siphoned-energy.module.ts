import { Module } from '@nestjs/common';
import { SiphonedEnergyService } from './siphoned-energy.service';
import { SiphonedEnergyController } from './siphoned-energy.controller';

@Module({
  controllers: [SiphonedEnergyController],
  providers: [SiphonedEnergyService],
})
export class SiphonedEnergyModule {}
