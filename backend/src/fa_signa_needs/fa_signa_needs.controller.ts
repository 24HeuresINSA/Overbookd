import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FaSignaNeedsService } from './fa_signa_needs.service';
import { CreateFaSignaNeedDto } from './dto/create-fa_signa_need.dto';
import { UpdateFaSignaNeedDto } from './dto/update-fa_signa_need.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('fa-signa-needs')
@Controller('fa-signa-needs')
export class FaSignaNeedsController {
  constructor(private readonly faSignaNeedsService: FaSignaNeedsService) {}

  @Post()
  create(@Body() createFaSignaNeedDto: CreateFaSignaNeedDto) {
    return this.faSignaNeedsService.create(createFaSignaNeedDto);
  }

  @Get()
  findAll() {
    return this.faSignaNeedsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faSignaNeedsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFaSignaNeedDto: UpdateFaSignaNeedDto,
  ) {
    return this.faSignaNeedsService.update(+id, updateFaSignaNeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faSignaNeedsService.remove(+id);
  }
}
