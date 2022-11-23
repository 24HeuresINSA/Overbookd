import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TimeWindowsService } from './time_windows.service';
import { CreateTimeWindowDto } from './dto/create-time_window.dto';
import { UpdateTimeWindowDto } from './dto/update-time_window.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('time-windows')
@Controller('time-windows')
export class TimeWindowsController {
  constructor(private readonly timeWindowsService: TimeWindowsService) {}

  @Post()
  create(@Body() createTimeWindowDto: CreateTimeWindowDto) {
    return this.timeWindowsService.create(createTimeWindowDto);
  }

  @Get()
  findAll() {
    return this.timeWindowsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeWindowsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimeWindowDto: UpdateTimeWindowDto,
  ) {
    return this.timeWindowsService.update(+id, updateTimeWindowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeWindowsService.remove(+id);
  }
}
