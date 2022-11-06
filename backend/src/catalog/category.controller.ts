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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/team-auth.guard';
import { CategoryFormRequestDto } from './dto/categoryCreationRequest.dto';
import { Category, CategoryTree } from './interfaces';
import { CategoryResponseDto } from './dto/categoryResponse.dto';
import { CategoryTreeResponseDto } from './dto/categoryTreeResponse.dto';

@ApiBearerAuth()
@ApiTags('catalog')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiUnauthorizedResponse({
  description: 'User must be authenticated',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
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
  find(@Param('id') id: number): Promise<Category> {
    return this.categoryService.find(id);
  }

  @Delete(':id')
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
  remove(@Param('id') id: number): Promise<void> {
    return this.categoryService.remove(id);
  }

  @Post()
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
    @Param('id') id: number,
    @Body() categoryForm: CategoryFormRequestDto,
  ): Promise<Category> {
    return this.categoryService.update({ id, ...categoryForm });
  }
}
