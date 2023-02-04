import {
  Body,
  Controller,
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
    type: [FtUserRequestResponseDto],
  })
  @ApiBody({
    description: 'All of the user requests to create',
    type: [FtUserRequestDto],
  })
  async create(
    @Body() requests: FtUserRequestDto[],
    @Param('ftId', ParseIntPipe) ftId: number,
    @Param('twId', ParseIntPipe) twId: number,
  ): Promise<FtUserRequestResponseDto[]> {
    return this.ftUserRequestService.create(requests, ftId, twId);
  }
}
