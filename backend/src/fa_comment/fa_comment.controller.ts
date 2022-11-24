import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FaCommentService } from './fa_comment.service';
import { CreateFaCommentDto } from './dto/create-fa_comment.dto';
import { UpdateFaCommentDto } from './dto/update-fa_comment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('fa-comment')
@Controller('fa-comment')
export class FaCommentController {
  constructor(private readonly faCommentService: FaCommentService) {}

  @Post()
  create(@Body() createFaCommentDto: CreateFaCommentDto) {
    return this.faCommentService.create(createFaCommentDto);
  }

  @Get()
  findAll() {
    return this.faCommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faCommentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFaCommentDto: UpdateFaCommentDto,
  ) {
    return this.faCommentService.update(+id, updateFaCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faCommentService.remove(+id);
  }
}
