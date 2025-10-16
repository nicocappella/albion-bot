import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SiphonedEnergyService } from './siphoned-energy.service';
import { CreateSiphonedEnergyDto } from './dto/create-siphoned-energy.dto';
import { UpdateSiphonedEnergyDto } from './dto/update-siphoned-energy.dto';

@Controller('siphoned-energy')
export class SiphonedEnergyController {
  constructor(private readonly siphonedEnergyService: SiphonedEnergyService) {}

  @Post()
  create(@Body() createSiphonedEnergyDto: CreateSiphonedEnergyDto) {
    return this.siphonedEnergyService.create(createSiphonedEnergyDto);
  }

  @Get()
  findAll() {
    return this.siphonedEnergyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siphonedEnergyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSiphonedEnergyDto: UpdateSiphonedEnergyDto) {
    return this.siphonedEnergyService.update(+id, updateSiphonedEnergyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siphonedEnergyService.remove(+id);
  }
}
