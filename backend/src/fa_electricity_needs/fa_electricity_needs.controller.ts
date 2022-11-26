import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FaElectricityNeedsService } from './fa_electricity_needs.service';
import { CreateFaElectricityNeedDto } from './dto/create-fa_electricity_need.dto';
import { UpdateFaElectricityNeedDto } from './dto/update-fa_electricity_need.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('fa_electricity_needs')
@Controller('fa-electricity-needs')
export class FaElectricityNeedsController {
  constructor(
    private readonly faElectricityNeedsService: FaElectricityNeedsService,
  ) {}

  @Post()
  create(@Body() createFaElectricityNeedDto: CreateFaElectricityNeedDto) {
    return this.faElectricityNeedsService.create(createFaElectricityNeedDto);
  }

  @Get()
  findAll() {
    return this.faElectricityNeedsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faElectricityNeedsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFaElectricityNeedDto: UpdateFaElectricityNeedDto,
  ) {
    return this.faElectricityNeedsService.update(
      +id,
      updateFaElectricityNeedDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faElectricityNeedsService.remove(+id);
  }
}
