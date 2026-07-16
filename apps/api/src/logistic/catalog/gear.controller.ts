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
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CatalogService } from "./catalog.service";
import { GearFormRequestDto } from "./dto/gear-form.request.dto";
import { CatalogGearResponseDto } from "../common/dto/catalog-gear.response.dto";
import { Permissions } from "../../authentication-zitadel/decorators/permissions-auth.decorator";
import { READ_GEAR_CATALOG, WRITE_GEAR_CATALOG } from "@overbookd/permission";
import { GearSearchRequestDto } from "../common/dto/gear-search.request.dto";
import { CatalogGear } from "@overbookd/http";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";

@Controller("logistic/gears")
@ApiTags("logistic/catalog")
@ApiBearerAuth()
@ApiSwaggerResponse()
export class GearController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  @Permissions(READ_GEAR_CATALOG)
  @ApiResponse({
    status: 200,
    description: "Get gears that match search",
    isArray: true,
    type: CatalogGearResponseDto,
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Get gears that match the name or the reference code",
  })
  @ApiQuery({
    name: "category",
    required: false,
    type: String,
    description: "Get gears that match the category with category name",
  })
  @ApiQuery({
    name: "owner",
    required: false,
    type: String,
    description: "Get gears that are owned by team that match name",
  })
  search(@Query() searchOptions: GearSearchRequestDto): Promise<CatalogGear[]> {
    return this.catalogService.search(searchOptions);
  }

  @Get(":id")
  @Permissions(READ_GEAR_CATALOG)
  @ApiResponse({
    status: 200,
    description: "Get a specific gear",
    type: CatalogGearResponseDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Gear id",
    required: true,
  })
  get(@Param("id", ParseIntPipe) id: number): Promise<CatalogGear> {
    return this.catalogService.find(id);
  }

  @Post()
  @Permissions(WRITE_GEAR_CATALOG)
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: "Creating a new gear",
    type: CatalogGearResponseDto,
  })
  create(@Body() gearForm: GearFormRequestDto): Promise<CatalogGear> {
    return this.catalogService.add(gearForm);
  }

  @Put(":id")
  @Permissions(WRITE_GEAR_CATALOG)
  @ApiResponse({
    status: 200,
    description: "Updating a gear",
    type: CatalogGearResponseDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Gear id",
    required: true,
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() gearForm: GearFormRequestDto,
  ): Promise<CatalogGear> {
    return this.catalogService.update({ id, ...gearForm });
  }

  @Delete(":id")
  @Permissions(WRITE_GEAR_CATALOG)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Delete a gear by id",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Gear id",
    required: true,
  })
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.catalogService.remove(id);
  }
}
