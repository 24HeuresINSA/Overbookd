import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FaService } from './fa.service';
import { CreateFaDto } from './dto/create-fa.dto';
import { UpdateFaDto } from './dto/update-fa.dto';

@Controller('fa')
export class FaController {
  constructor(private readonly faService: FaService) {}

  @Post()
  create(@Body() createFaDto: CreateFaDto) {
    return this.faService.create(createFaDto);
  }

  @Get()
  findAll() {
    return this.faService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaDto: UpdateFaDto) {
    return this.faService.update(+id, updateFaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faService.remove(+id);
  }
}
