import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/team-auth.decorator';
import { RolesGuard } from '../auth/team-auth.guard';
import { CreateFaSitePublishAnimationServiceDto } from './dto/fa_site_publish_animation.dto';
import { FaSitePublishAnimationService } from './fa_site_publish_animation.service';

@ApiBearerAuth()
@ApiTags('fa-site-publish-animation')
@Controller('fa-site-publish-animation')
export class FaSitePublishAnimationController {
  constructor(
    private readonly faSitePublishAnimationService: FaSitePublishAnimationService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Post()
  @ApiBody({ type: CreateFaSitePublishAnimationServiceDto })
  create(
    @Body()
    ceateFaSitePublishAnimationServiceDto: CreateFaSitePublishAnimationServiceDto,
  ) {
    return this.faSitePublishAnimationService.create(
      ceateFaSitePublishAnimationServiceDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Put(':id')
  @ApiBody({ type: CreateFaSitePublishAnimationServiceDto })
  update(
    @Body()
    ceateFaSitePublishAnimationServiceDto: CreateFaSitePublishAnimationServiceDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.faSitePublishAnimationService.update(
      id,
      ceateFaSitePublishAnimationServiceDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get()
  findAll() {
    return this.faSitePublishAnimationService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faSitePublishAnimationService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faSitePublishAnimationService.remove(+id);
  }
}
