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
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ftTimeWindowsResponseDto } from './dto/ftTimeWindowsResponse.dto';
import { UpsertFtTimeWindowsDto } from './dto/upsertFtTimeWindows.dto';
import { FtTimeWindowsService } from './ft_time_windows.service';

@ApiBearerAuth()
@ApiTags('ft')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller('ft')
export class FtTimeWindowsController {
  constructor(private readonly ftTimeWindowsService: FtTimeWindowsService) {}

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
    return this.ftTimeWindowsService.upsert(ftId, upsertFtTimeWindowsDto);
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
    return this.ftTimeWindowsService.remove(ftId, id);
  }
}
