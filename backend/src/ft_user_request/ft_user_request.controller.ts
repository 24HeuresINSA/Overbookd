import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { FtUserRequestDto } from './dto/ft_user_request.dto';
import { FtUserRequestService } from './ft_user_request.service';

@ApiBearerAuth()
@ApiTags('ft-user-request')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller('ft-user-request')
export class FtUserRequestController {
  constructor(private readonly ftUserRequestService: FtUserRequestService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post()
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Request created' })
  async create(@Body() request: FtUserRequestDto) {
    await this.ftUserRequestService.create(request);
  }
}
