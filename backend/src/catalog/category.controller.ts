import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
  HttpCode,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
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
import { CategoryFormRequestDto } from './dto/categoryFormRequest.dto';
import { Category, CategoryTree } from './interfaces';
import { CategoryResponseDto } from './dto/categoryResponse.dto';
import { CategoryTreeResponseDto } from './dto/categoryTreeResponse.dto';
import { CategorySearchRequestDto } from './dto/categorySearchRequest.dto';
import { logTeams } from 'src/team/teams.constant';
import { Permissions } from 'src/auth/team-auth.decorator';
import { PermissionsGuard } from 'src/auth/team-auth.guard';

@ApiBearerAuth()
@ApiTags('catalog')
@Controller('categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiUnauthorizedResponse({
  description: 'User must be authenticated',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('')
  @Permissions('hard')
  @ApiResponse({
    status: 200,
    description: 'Get categories that match search',
    isArray: true,
    type: CategoryResponseDto,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Get categories that match the name',
  })
  @ApiQuery({
    name: 'owner',
    required: false,
    type: String,
    description: 'Get categories that are owned by team that match name',
  })
  search(
    @Query() { name, owner }: CategorySearchRequestDto,
  ): Promise<Category[]> {
    return this.categoryService.search({ name, owner });
  }

  @Get('/tree')
  @Permissions('hard')
  @ApiResponse({
    status: 200,
    description: 'Get categories tree',
    type: CategoryTreeResponseDto,
    isArray: true,
  })
  getAll(): Promise<CategoryTree[]> {
    return this.categoryService.getAll();
  }

  @Get(':id')
  @Permissions(...logTeams)
  @ApiResponse({
    status: 200,
    description: 'Get a specific category',
    type: CategoryResponseDto,
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
    description: 'Category id',
    required: true,
  })
  find(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoryService.find(id);
  }

  @Delete(':id')
  @Permissions(...logTeams)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Delete a category by id',
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
    description: 'Category id',
    required: true,
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.remove(id);
  }

  @Post()
  @Permissions(...logTeams)
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Creating a new category',
    type: CategoryResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  create(@Body() categoryForm: CategoryFormRequestDto): Promise<Category> {
    return this.categoryService.create(categoryForm);
  }

  @Put(':id')
  @Permissions(...logTeams)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Updating a category',
    type: CategoryResponseDto,
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
    description: 'Category id',
    required: true,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() categoryForm: CategoryFormRequestDto,
  ): Promise<Category> {
    return this.categoryService.update({ id, ...categoryForm });
  }
}
