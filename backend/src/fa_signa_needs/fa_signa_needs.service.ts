import { Injectable } from '@nestjs/common';
import { CreateFaSignaNeedDto } from './dto/create-fa_signa_need.dto';
import { UpdateFaSignaNeedDto } from './dto/update-fa_signa_need.dto';

@Injectable()
export class FaSignaNeedsService {
  create(createFaSignaNeedDto: CreateFaSignaNeedDto) {
    return 'This action adds a new faSignaNeed';
  }

  findAll() {
    return `This action returns all faSignaNeeds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} faSignaNeed`;
  }

  update(id: number, updateFaSignaNeedDto: UpdateFaSignaNeedDto) {
    return `This action updates a #${id} faSignaNeed`;
  }

  remove(id: number) {
    return `This action removes a #${id} faSignaNeed`;
  }
}
