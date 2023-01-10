import { Injectable } from '@nestjs/common';
import { CreateFtDto } from './dto/create-ft.dto';
import { UpdateFtDto } from './dto/update-ft.dto';

@Injectable()
export class FtService {
  create(createFtDto: CreateFtDto) {
    return 'This action adds a new ft';
  }

  findAll() {
    return `This action returns all ft`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ft`;
  }

  update(id: number, updateFtDto: UpdateFtDto) {
    return `This action updates a #${id} ft`;
  }

  remove(id: number) {
    return `This action removes a #${id} ft`;
  }
}
