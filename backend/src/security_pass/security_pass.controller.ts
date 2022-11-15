import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SecurityPassService } from './security_pass.service';
import { CreateSecurityPassDto } from './dto/create-security_pass.dto';
import { UpdateSecurityPassDto } from './dto/update-security_pass.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('security_pass')
@Controller('security-pass')
export class SecurityPassController {
  constructor(private readonly securityPassService: SecurityPassService) {}

  @Post()
  create(@Body() createSecurityPassDto: CreateSecurityPassDto) {
    return this.securityPassService.create(createSecurityPassDto);
  }

  @Get()
  findAll() {
    return this.securityPassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.securityPassService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSecurityPassDto: UpdateSecurityPassDto,
  ) {
    return this.securityPassService.update(+id, updateSecurityPassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.securityPassService.remove(+id);
  }
}
