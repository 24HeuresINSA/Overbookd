import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { READ_INVENTORY, WRITE_INVENTORY } from "@overbookd/permission";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { InventoryGroupedRecordResponseDto } from "./dto/inventory-grouped-record.response.dto";
import { InventoryGroupedRecordSearchRequestDto } from "./dto/inventory-grouped-record-search.request.dto";
import { InventoryRecordDto } from "./dto/inventory-record.dto";
import { InventoryService } from "./inventory.service";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";

@Controller("logistic/inventory")
@ApiTags("logistic/inventory")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiSwaggerResponse()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @Permission(READ_INVENTORY)
  @ApiResponse({
    status: 200,
    description: "Get inventory grouped records that match search",
    isArray: true,
    type: InventoryGroupedRecordResponseDto,
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description:
      "Get inventory grouped records with gear that match the name or the reference code",
  })
  @ApiQuery({
    name: "category",
    required: false,
    type: String,
    description:
      "Get inventory grouped records with gear that match the category with category name",
  })
  @ApiQuery({
    name: "owner",
    required: false,
    type: String,
    description:
      "Get inventory grouped records with gear that are owned by team that match name",
  })
  @ApiQuery({
    name: "storage",
    required: false,
    type: String,
    description:
      "Get inventory grouped records that are stored in this storage location",
  })
  search(
    @Query() searchOptions: InventoryGroupedRecordSearchRequestDto,
  ): Promise<InventoryGroupedRecordResponseDto[]> {
    return this.inventoryService.search(searchOptions);
  }

  @Post()
  @Permission(WRITE_INVENTORY)
  @ApiResponse({
    status: 201,
    description:
      "Setup the inventory with the given records. It erases previous records",
    isArray: true,
    type: InventoryGroupedRecordResponseDto,
  })
  @ApiBody({
    description: "Records inventory will be setup with",
    isArray: true,
    type: InventoryRecordDto,
  })
  setup(
    @Body() records: InventoryRecordDto[],
  ): Promise<InventoryGroupedRecordResponseDto[]> {
    return this.inventoryService.setup(records);
  }

  @Get("storages")
  @Permission(READ_INVENTORY)
  @ApiResponse({
    status: 200,
    description: "Get inventory records storages",
    isArray: true,
    type: String,
  })
  getStorages(): Promise<string[]> {
    return this.inventoryService.getStoragesHavingGear();
  }

  @Get(":gearId")
  @Permission(READ_INVENTORY)
  @ApiResponse({
    status: 200,
    description: "Get inventory records for a specific gear",
    isArray: true,
    type: InventoryRecordDto,
  })
  @ApiParam({
    name: "gearId",
    type: Number,
    description: "Gear id",
    required: true,
  })
  details(
    @Param("gearId", ParseIntPipe) gearId: number,
  ): Promise<InventoryRecordDto[]> {
    return this.inventoryService.getDetails(gearId);
  }
}
