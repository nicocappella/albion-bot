import { Injectable } from '@nestjs/common';
import { CreateSiphonedEnergyDto } from './dto/create-siphoned-energy.dto';
import { UpdateSiphonedEnergyDto } from './dto/update-siphoned-energy.dto';

@Injectable()
export class SiphonedEnergyService {
  create(createSiphonedEnergyDto: CreateSiphonedEnergyDto) {
    return 'This action adds a new siphonedEnergy';
  }

  findAll() {
    return `This action returns all siphonedEnergy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} siphonedEnergy`;
  }

  update(id: number, updateSiphonedEnergyDto: UpdateSiphonedEnergyDto) {
    return `This action updates a #${id} siphonedEnergy`;
  }

  remove(id: number) {
    return `This action removes a #${id} siphonedEnergy`;
  }
}
