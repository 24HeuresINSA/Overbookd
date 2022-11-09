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
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/team-auth.guard';
import { CatalogService } from './catalog.service';
import { GearCreationRequestDto } from './dto/gearFormRequest.dto';
import { GearResponseDto } from './dto/gearResponse.dto';
import { GearSearchRequestDto } from './dto/gearSearchRequest.dto';
import { Gear } from './interfaces';

@Controller('gears')
@ApiTags('catalog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiUnauthorizedResponse({
  description: 'User must be authenticated',
})
export class GearController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all gears',
    isArray: true,
    type: GearResponseDto,
  })
  getAll(): Promise<Gear[]> {
    return this.catalogService.getAll();
  }

  @Get('search')
  @ApiResponse({
    status: 200,
    description: 'Get gears that match search',
    isArray: true,
    type: GearResponseDto,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Get gears that match the name',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Get gears that match the category with category name',
  })
  @ApiQuery({
    name: 'owner',
    required: false,
    type: String,
    description: 'Get gears that are owned by team that match name',
  })
  search(@Query() { name, category }: GearSearchRequestDto): Promise<Gear[]> {
    return this.catalogService.search({ name, category });
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a specific gear',
    type: GearResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Gear id',
    required: true,
  })
  get(@Param('id', ParseIntPipe) id: number): Promise<Gear> {
    return this.catalogService.find(id);
  }

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Creating a new gear',
    type: GearResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  create(@Body() gearForm: GearCreationRequestDto): Promise<Gear> {
    return this.catalogService.add(gearForm);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Updating a gear',
    type: GearResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Gear id',
    required: true,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() gearForm: GearCreationRequestDto,
  ): Promise<Gear> {
    return this.catalogService.update({ id, ...gearForm });
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Delete a gear by id',
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Gear id',
    required: true,
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.catalogService.remove(id);
  }
}
