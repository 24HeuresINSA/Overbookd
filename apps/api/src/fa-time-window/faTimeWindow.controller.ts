import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permission } from '../authentication/permissions-auth.decorator';
import { PermissionsGuard } from '../authentication/permissions-auth.guard';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { FaTimeWindowFormRequestDto } from './dto/faTimeWindowFormRequest.dto';
import { FaTimeWindowService } from './faTimeWindow.service';
import { FaTimeWindowResponseDto } from './dto/faTimeWindowResponse.dto';
import { FaTimeWindow } from './faTimeWindow.model';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@ApiTags('fa')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller('fa')
export class FaTimeWindowController {
  constructor(private readonly faTimeWindowService: FaTimeWindowService) {}

  @Permission('hard')
  @Post(':faId/time-windows')
  @ApiResponse({
    status: 201,
    description: 'The fa time window have been successfully upserted.',
    type: FaTimeWindowResponseDto,
    isArray: true,
  })
  @ApiParam({
    name: 'faId',
    type: Number,
    description: 'FA id',
    required: true,
  })
  @ApiBody({
    type: FaTimeWindowFormRequestDto,
    description: 'FA time window to upsert',
  })
  upsert(
    @Param('faId', ParseIntPipe) faId: number,
    @Body() timeWIndow: FaTimeWindowFormRequestDto,
  ): Promise<FaTimeWindow> {
    return this.faTimeWindowService.upsert(faId, timeWIndow);
  }

  @Permission('hard')
  @Delete(':faId/time-windows/:id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'The fa time window have been successfully deleted.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'FA time window id',
    required: true,
  })
  @ApiParam({
    name: 'faId',
    type: Number,
    description: 'FA id',
    required: true,
  })
  remove(
    @Param('faId', ParseIntPipe) faId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.faTimeWindowService.remove(faId, id);
  }
}
