import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { InventoryGroupedRecordResponseDto } from "./dto/inventory-grouped-record.response.dto";
import { InventoryGroupedRecordSearchRequestDto } from "./dto/inventory-grouped-record-search.request.dto";
import { InventoryRecordDto } from "./dto/inventory-record.dto";
import { InventoryRecord, InventoryService } from "./inventory.service";

@Controller("inventory")
@ApiTags("inventory")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiUnauthorizedResponse({
  description: "User must be authenticated",
})
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Permission("write-inventory")
  @Get("")
  @ApiResponse({
    status: 200,
    description: "Get inventory grouped records that match search",
    isArray: true,
    type: InventoryGroupedRecordResponseDto,
  })
  @ApiQuery({
    name: "name",
    required: false,
    type: String,
    description: "Get grouped records with gear that match the name",
  })
  search(
    @Query() { name }: InventoryGroupedRecordSearchRequestDto,
  ): Promise<InventoryGroupedRecordResponseDto[]> {
    return this.inventoryService.search({ name });
  }

  @Permission("write-inventory")
  @Post("")
  @HttpCode(201)
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
    @Body() records: InventoryRecord[],
  ): Promise<InventoryGroupedRecordResponseDto[]> {
    return this.inventoryService.setup(records);
  }

  @Permission("write-inventory")
  @Get(":gearId")
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
