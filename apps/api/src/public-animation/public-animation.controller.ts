import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { Permission } from '../authentication/permissions-auth.decorator';
import { PermissionsGuard } from '../authentication/permissions-auth.guard';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { CreatePublicAnimationRequestDto } from './dto/create-public-animation.request.dto';
import { UpdatePublicAnimationRequestDto } from './dto/update-public-animation.request.dto';
import { PublicAnimationResponseDto } from './dto/public-animation.response.dto';
import { PublicAnimationWithFaResponseDto } from './dto/public-animation-with-fa.response.dto';
import { PublicAnimationService } from './public-animation.service';

@ApiBearerAuth()
@ApiTags('fa')
@Controller('public-animation')
export class PublicAnimationController {
  constructor(
    private readonly publicAnimationService: PublicAnimationService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post()
  @ApiBody({ type: CreatePublicAnimationRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Create a new public animation',
    type: PublicAnimationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  create(@Body() publicAnimation: CreatePublicAnimationRequestDto) {
    return this.publicAnimationService.create(publicAnimation);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Put(':faId')
  @ApiResponse({
    status: 200,
    description: 'Updating a public animation',
    type: PublicAnimationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiNotFoundResponse({
    description: "Can't find a public animation resource",
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  @ApiBody({ type: UpdatePublicAnimationRequestDto })
  update(
    @Body() publicAnimation: UpdatePublicAnimationRequestDto,
    @Param('faId', ParseIntPipe) id: number,
  ) {
    return this.publicAnimationService.update(id, publicAnimation);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all public animations',
    isArray: true,
    type: PublicAnimationWithFaResponseDto,
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  findAll(): Promise<PublicAnimationWithFaResponseDto[]> {
    return this.publicAnimationService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':faId')
  @ApiResponse({
    status: 200,
    description: 'Get a public animation',
    isArray: false,
    type: PublicAnimationResponseDto,
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  @ApiNotFoundResponse({
    description: "Can't find this public animation resource",
  })
  findOne(@Param('faId', ParseIntPipe) id: number) {
    return this.publicAnimationService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':faId')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Delete a public animation',
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  remove(@Param('faId', ParseIntPipe) id: number) {
    return this.publicAnimationService.remove(id);
  }
}
