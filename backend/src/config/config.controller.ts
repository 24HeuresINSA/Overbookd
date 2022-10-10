import { Controller, Get } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('config')
@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get config',
  })
  getConfig() {
    //return a json object with all the configuration
    return this.configService.config();
  }
}
