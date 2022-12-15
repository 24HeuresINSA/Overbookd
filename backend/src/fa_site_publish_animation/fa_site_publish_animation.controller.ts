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
import { FaSitePublishAnimationFormRequestDto } from './dto/faSitePublishAnimationFormRequest.dto';
import { FaSitePublishAnimationResponseDto } from './dto/faSitePublishAnimationResponse.dto';
import { FaSitePublishAnimationService } from './fa_site_publish_animation.service';

@ApiBearerAuth()
@ApiTags('fa')
@Controller('fa-site-publish-animation')
export class FaSitePublishAnimationController {
  constructor(
    private readonly faSitePublishAnimationService: FaSitePublishAnimationService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Post()
  @ApiBody({ type: FaSitePublishAnimationFormRequestDto })
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
    publishAnimationForm: FaSitePublishAnimationFormRequestDto,
  ) {
    return this.faSitePublishAnimationService.create(publishAnimationForm);
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
  @ApiBody({ type: FaSitePublishAnimationFormRequestDto })
  update(
    @Body()
    publishAnimationForm: FaSitePublishAnimationFormRequestDto,
    @Param('faId', ParseIntPipe) id: number,
  ) {
    return this.faSitePublishAnimationService.update(id, publishAnimationForm);
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
  @ApiForbiddenResponse({
    description: "User can't access this resource",
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
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  @ApiNotFoundResponse({
    description: "Can't find this site publish animation resource",
  })
  findOne(@Param('faId', ParseIntPipe) id: number) {
    return this.faSitePublishAnimationService.findOne(id);
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
    return this.faSitePublishAnimationService.remove(id);
  }
}
