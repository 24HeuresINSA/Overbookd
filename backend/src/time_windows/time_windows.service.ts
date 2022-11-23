import { Injectable } from '@nestjs/common';
import { CreateTimeWindowDto } from './dto/create-time_window.dto';
import { UpdateTimeWindowDto } from './dto/update-time_window.dto';

@Injectable()
export class TimeWindowsService {
  create(createTimeWindowDto: CreateTimeWindowDto) {
    return 'This action adds a new timeWindow';
  }

  findAll() {
    return `This action returns all timeWindows`;
  }

  findOne(id: number) {
    return `This action returns a #${id} timeWindow`;
  }

  update(id: number, updateTimeWindowDto: UpdateTimeWindowDto) {
    return `This action updates a #${id} timeWindow`;
  }

  remove(id: number) {
    return `This action removes a #${id} timeWindow`;
  }
}
