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
} from "@nestjs/common";
import { CategoryService } from "./category.service";
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
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { CategoryFormRequestDto } from "./dto/category-form.request.dto";
import { CategoryResponseDto } from "./dto/category.response.dto";
import { CategoryTreeResponseDto } from "./dto/category-tree.response.dto";
import { CategorySearchRequestDto } from "./dto/category-search.request.dto";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { READ_GEAR_CATALOG, WRITE_GEAR_CATALOG } from "@overbookd/permission";
import { CatalogCategory, CatalogCategoryTree } from "@overbookd/http";

@ApiBearerAuth()
@ApiTags("logistic/catalog")
@Controller("logistic/categories")
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiUnauthorizedResponse({
  description: "User must be authenticated",
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Permission(READ_GEAR_CATALOG)
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

  @Get("/tree")
  @Permission(READ_GEAR_CATALOG)
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
  @Permission(WRITE_GEAR_CATALOG)
  @ApiResponse({
    status: 200,
    description: "Get a specific category",
    type: CategoryResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Request is not formated as expected",
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
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
  @Permission(WRITE_GEAR_CATALOG)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Delete a category by id",
  })
  @ApiBadRequestResponse({
    description: "Request is not formated as expected",
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
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
  @Permission(WRITE_GEAR_CATALOG)
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: "Creating a new category",
    type: CategoryResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Request is not formated as expected",
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
  })
  create(
    @Body() categoryForm: CategoryFormRequestDto,
  ): Promise<CatalogCategory> {
    return this.categoryService.create(categoryForm);
  }

  @Put(":id")
  @Permission(WRITE_GEAR_CATALOG)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Updating a category",
    type: CategoryResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Request is not formated as expected",
  })
  @ApiNotFoundResponse({
    description: "Can't find a requested resource",
  })
  @ApiForbiddenResponse({
    description: "User can't access this resource",
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
