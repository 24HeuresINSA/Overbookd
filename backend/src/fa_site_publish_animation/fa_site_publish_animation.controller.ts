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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/team-auth.decorator';
import { RolesGuard } from '../auth/team-auth.guard';
import { FaSitePublishAnimationResponseDto } from './dto/faSitePublishAnimationResponse.dto';
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
  @ApiResponse({
    status: 201,
    description: 'Create a new fa site publish animation',
    type: FaSitePublishAnimationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
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
  @Put(':faId')
  @ApiResponse({
    status: 200,
    description: 'Updating a fa site publish animation',
    type: FaSitePublishAnimationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiNotFoundResponse({
    description: "Can't find a site publish animation resource",
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  @ApiBody({ type: CreateFaSitePublishAnimationServiceDto })
  update(
    @Body()
    ceateFaSitePublishAnimationServiceDto: CreateFaSitePublishAnimationServiceDto,
    @Param('faId', ParseIntPipe) id: number,
  ) {
    return this.faSitePublishAnimationService.update(
      id,
      ceateFaSitePublishAnimationServiceDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all fa site publish animations',
    isArray: true,
    type: FaSitePublishAnimationResponseDto,
  })
  findAll() {
    return this.faSitePublishAnimationService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get(':faId')
  @ApiResponse({
    status: 200,
    description: 'Get a fa site publish animation',
    isArray: false,
    type: FaSitePublishAnimationResponseDto,
  })
  findOne(@Param('faId', ParseIntPipe) id: number) {
    return this.faSitePublishAnimationService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Delete(':faId')
  @ApiResponse({
    status: 204,
    description: 'Delete a fa site publish animation',
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  remove(@Param('faId', ParseIntPipe) id: number) {
    return this.faSitePublishAnimationService.remove(+id);
  }
}
