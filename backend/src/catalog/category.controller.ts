import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpCode,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '/src/catalog/interfaces';
import { Team } from '/src/catalog/interfaces';
import { CategoryTree } from '/src/catalog/interfaces';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/team-auth.guard';
import { Roles } from 'src/auth/team-auth.decorator';
import { RequestWithUserPayload } from 'src/app.controller';
import { CategoryCreationRequestDto } from './dto/categoryCreationRequest.dto';
import { CategoryDeleteRequestDto } from './dto/categoryDeleteRequest.dto';

@ApiBearerAuth()
@ApiTags('category')
@Controller('category')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all categories',
    type: Array<CategoryTree>,
  })
  getAll(): Promise<CategoryTree[]> {
    return this.categoryService.getAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a specific category',
    type: Category,
  })
  find(@Param() { id }: CategoryDeleteRequestDto): Promise<Category> {
    return this.categoryService.find(id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Delete a category by id',
  })
  remove(@Param() { id }: CategoryDeleteRequestDto): Promise<void> {
    return this.categoryService.remove(id);
  }

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Creating a new category',
    type: Category,
  })
  create(@Body() categoryForm: CategoryCreationRequestDto): Promise<Category> {
    return this.categoryService.create(categoryForm);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Updating a category',
    type: Category,
  })
  update(
    @Param() { id }: CategoryDeleteRequestDto,
    @Body() categoryForm: CategoryCreationRequestDto,
  ): Promise<Category> {
    return this.categoryService.update({ id, ...categoryForm });
  }
}
