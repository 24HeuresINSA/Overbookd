import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { InventoryGroupedRecordResponseDto } from './dto/inventoryGroupedRecordResponse.dto';
import { InventoryGroupedRecordSearchRequestDto } from './dto/inventoryGroupedRecordSearchRequest.dto';
import { InventoryRecordDto } from './dto/inventoryRecord.dto';
import { InventoryRecord, InventoryService } from './inventory.service';

@Controller('inventory')
@ApiTags('inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiUnauthorizedResponse({
  description: 'User must be authenticated',
})
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Permission('inventory-write')
  @Get('')
  @ApiResponse({
    status: 200,
    description: 'Get inventory grouped records that match search',
    isArray: true,
    type: InventoryGroupedRecordResponseDto,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Get grouped records with gear that match the name',
  })
  search(
    @Query() { name }: InventoryGroupedRecordSearchRequestDto,
  ): Promise<InventoryGroupedRecordResponseDto[]> {
    return this.inventoryService.search({ name });
  }

  @Permission('inventory-write')
  @Post('')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description:
      'Setup the inventory with the given records. It erases previous records',
    isArray: true,
    type: InventoryGroupedRecordResponseDto,
  })
  @ApiBody({
    description: 'Records inventory will be setup with',
    isArray: true,
    type: InventoryRecordDto,
  })
  setup(
    @Body() records: InventoryRecord[],
  ): Promise<InventoryGroupedRecordResponseDto[]> {
    return this.inventoryService.setup(records);
  }
}
