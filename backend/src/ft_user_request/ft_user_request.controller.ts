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
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { FtUserRequestResponseDto } from './dto/ftUserRequestResponse.dto';
import { FtUserRequestDto } from './dto/ft_user_request.dto';
import { FtUserRequestService } from './ft_user_request.service';

@ApiBearerAuth()
@ApiTags('ft')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiNotFoundResponse({
  description: 'Resource not found',
})
@Controller('ft')
export class FtUserRequestController {
  constructor(private readonly ftUserRequestService: FtUserRequestService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post('/:ftId/time-windows/:twId/user-requests')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The user request has been successfully created.',
    type: FtUserRequestResponseDto,
    isArray: true,
  })
  @ApiBody({
    description: 'All of the user requests to create',
    type: FtUserRequestDto,
    isArray: true,
  })
  async create(
    @Body() requests: FtUserRequestDto[],
    @Param('ftId', ParseIntPipe) ftId: number,
    @Param('twId', ParseIntPipe) twId: number,
  ): Promise<FtUserRequestResponseDto[]> {
    return this.ftUserRequestService.create(requests, ftId, twId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete('/:ftId/time-windows/:twId/user-requests')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'The user requests have been successfully deleted.',
  })
  @ApiBody({
    description: 'The user request to delete',
    type: FtUserRequestDto,
  })
  async delete(
    @Body() request: FtUserRequestDto,
    @Param('ftId', ParseIntPipe) ftId: number,
    @Param('twId', ParseIntPipe) twId: number,
  ): Promise<void> {
    return this.ftUserRequestService.delete(request, ftId, twId);
  }
}
