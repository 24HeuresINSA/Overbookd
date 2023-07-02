import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Logger,
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
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ftTimeWindowsResponseDto } from './dto/ftTimeWindowsResponse.dto';
import { UpsertFtTimeWindowsDto } from './dto/upsertFtTimeWindows.dto';
import { FtTimeWindowService } from './ftTimeWindow.service';

@ApiBearerAuth()
@ApiTags('ft')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller('ft')
export class FtTimeWindowController {
  constructor(private readonly ftTimeWindowService: FtTimeWindowService) {}

  private readonly logger = new Logger(FtTimeWindowController.name);

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':ftId/time-windows')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The ft time windows have been successfully upserted.',
    type: ftTimeWindowsResponseDto,
    isArray: true,
  })
  @ApiParam({
    name: 'ftId',
    type: Number,
    description: 'FT id',
    required: true,
  })
  @ApiBody({
    type: UpsertFtTimeWindowsDto,
    description: 'FT time window to upsert',
  })
  upsert(
    @Param('ftId', ParseIntPipe) ftId: number,
    @Body() upsertFtTimeWindowsDto: UpsertFtTimeWindowsDto,
  ): Promise<ftTimeWindowsResponseDto> {
    this.logger.log(`Inserting or updating timewindow for FT#${ftId}`);
    return this.ftTimeWindowService.upsert(ftId, upsertFtTimeWindowsDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':ftId/time-windows/:id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'The ft time windows have been successfully deleted.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'FT time windows id',
    required: true,
  })
  @ApiParam({
    name: 'ftId',
    type: Number,
    description: 'FT id',
    required: true,
  })
  remove(
    @Param('ftId', ParseIntPipe) ftId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    this.logger.log(`Removing timewindow #${id} for FT #${ftId}`);
    return this.ftTimeWindowService.remove(ftId, id);
  }
}
