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

@ApiBearerAuth()
@ApiTags('transaction')
@Controller('transaction')
export class CategoryController {
  constructor(private readonly categoryService: CategoryController) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get a category',
    type: Array,
  })
  find(@Param('id', ParseIntPipe) id: number): Promise<Category[]> {
    return this.categoryService.find(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all categories',
    type: Array,
  })
  getAll(): Promise<CategoryTree[]> {
    return this.categoryService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Delete a category by id',
    type: Array,
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
