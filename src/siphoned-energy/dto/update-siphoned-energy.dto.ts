import { PartialType } from '@nestjs/mapped-types';
import { CreateSiphonedEnergyDto } from './create-siphoned-energy.dto';

export class UpdateSiphonedEnergyDto extends PartialType(CreateSiphonedEnergyDto) {}
