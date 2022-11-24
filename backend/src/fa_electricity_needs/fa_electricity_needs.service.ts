import { Injectable } from '@nestjs/common';
import { CreateFaElectricityNeedDto } from './dto/create-fa_electricity_need.dto';
import { UpdateFaElectricityNeedDto } from './dto/update-fa_electricity_need.dto';

@Injectable()
export class FaElectricityNeedsService {
  create(createFaElectricityNeedDto: CreateFaElectricityNeedDto) {
    return 'This action adds a new faElectricityNeed';
  }

  findAll() {
    return `This action returns all faElectricityNeeds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} faElectricityNeed`;
  }

  update(id: number, updateFaElectricityNeedDto: UpdateFaElectricityNeedDto) {
    return `This action updates a #${id} faElectricityNeed`;
  }

  remove(id: number) {
    return `This action removes a #${id} faElectricityNeed`;
  }
}
