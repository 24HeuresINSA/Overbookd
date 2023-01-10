import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateFtDto } from './dto/create-ft.dto';
import { UpdateFtDto } from './dto/update-ft.dto';
import { FtService } from './ft.service';

@Controller('ft')
export class FtController {
  constructor(private readonly ftService: FtService) {}

  @Post()
  create(@Body() createFtDto: CreateFtDto) {
    return this.ftService.create(createFtDto);
  }

  @Get()
  findAll() {
    return this.ftService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ftService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFtDto: UpdateFtDto) {
    return this.ftService.update(+id, updateFtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ftService.remove(+id);
  }
}
