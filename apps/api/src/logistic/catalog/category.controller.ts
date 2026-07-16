import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  HttpCode,
  Put,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CategoryFormRequestDto } from "./dto/category-form.request.dto";
import { CategoryResponseDto } from "./dto/category.response.dto";
import { CategoryTreeResponseDto } from "./dto/category-tree.response.dto";
import { CategorySearchRequestDto } from "./dto/category-search.request.dto";
import { Permissions } from "../../authentication-zitadel/decorators/permissions-auth.decorator";
import { READ_GEAR_CATALOG, WRITE_GEAR_CATALOG } from "@overbookd/permission";
import { CatalogCategory, CatalogCategoryTree } from "@overbookd/http";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";

@Controller("logistic/categories")
@ApiTags("logistic/catalog")
@ApiBearerAuth()
@ApiSwaggerResponse()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Permissions(READ_GEAR_CATALOG)
  @ApiResponse({
    status: 200,
    description: "Get categories that match search",
    isArray: true,
    type: CategoryResponseDto,
  })
  @ApiQuery({
    name: "name",
    required: false,
    type: String,
    description: "Get categories that match the name",
  })
  @ApiQuery({
    name: "owner",
    required: false,
    type: String,
    description: "Get categories that are owned by team that match name",
  })
  search(
    @Query() { name, owner }: CategorySearchRequestDto,
  ): Promise<CatalogCategory[]> {
    return this.categoryService.search({ name, owner });
  }

  @Get("tree")
  @Permissions(READ_GEAR_CATALOG)
  @ApiResponse({
    status: 200,
    description: "Get categories tree",
    type: CategoryTreeResponseDto,
    isArray: true,
  })
  getAll(): Promise<CatalogCategoryTree[]> {
    return this.categoryService.getAll();
  }

  @Get(":id")
  @Permissions(WRITE_GEAR_CATALOG)
  @ApiResponse({
    status: 200,
    description: "Get a specific category",
    type: CategoryResponseDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Category id",
    required: true,
  })
  find(@Param("id", ParseIntPipe) id: number): Promise<CatalogCategory> {
    return this.categoryService.find(id);
  }

  @Delete(":id")
  @Permissions(WRITE_GEAR_CATALOG)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Delete a category by id",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Category id",
    required: true,
  })
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.remove(id);
  }

  @Post()
  @Permissions(WRITE_GEAR_CATALOG)
  @ApiResponse({
    status: 201,
    description: "Creating a new category",
    type: CategoryResponseDto,
  })
  create(
    @Body() categoryForm: CategoryFormRequestDto,
  ): Promise<CatalogCategory> {
    return this.categoryService.create(categoryForm);
  }

  @Put(":id")
  @Permissions(WRITE_GEAR_CATALOG)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Updating a category",
    type: CategoryResponseDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Category id",
    required: true,
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() categoryForm: CategoryFormRequestDto,
  ): Promise<CatalogCategory> {
    return this.categoryService.update({ id, ...categoryForm });
  }
}
