import { Injectable } from '@nestjs/common';
import { CreateFaCommentDto } from './dto/create-fa_comment.dto';
import { UpdateFaCommentDto } from './dto/update-fa_comment.dto';

@Injectable()
export class FaCommentService {
  create(createFaCommentDto: CreateFaCommentDto) {
    return 'This action adds a new faComment';
  }

  findAll() {
    return `This action returns all faComment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} faComment`;
  }

  update(id: number, updateFaCommentDto: UpdateFaCommentDto) {
    return `This action updates a #${id} faComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} faComment`;
  }
}
