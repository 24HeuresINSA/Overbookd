import { Injectable } from '@nestjs/common';
import { CreateFaDto } from './dto/create-fa.dto';
import { UpdateFaDto } from './dto/update-fa.dto';

@Injectable()
export class FaService {
  create(createFaDto: CreateFaDto) {
    return 'This action adds a new fa';
  }

  findAll() {
    return `This action returns all fa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fa`;
  }

  update(id: number, updateFaDto: UpdateFaDto) {
    return `This action updates a #${id} fa`;
  }

  remove(id: number) {
    return `This action removes a #${id} fa`;
  }
}
