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
import { CreateFtTeamRequestDto } from './dto/create-ft_team_request.dto';
import { DeleteFtTeamRequestDto } from './dto/deleteFtTeamRequest.dto';
import { FtTeamRequestResponseDto } from './dto/ftTeamRequestResponse.dto';
import { FtTeamRequestService } from './ft_team_request.service';

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
export class FtTeamRequestController {
  constructor(private readonly ftTeamRequestService: FtTeamRequestService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':ftId/time-windows/:twId/team-requests')
  @HttpCode(201)
  @ApiBody({
    description: 'All of the team requests to create',
    type: CreateFtTeamRequestDto,
    isArray: true,
  })
  @ApiResponse({
    status: 201,
    description: 'The team request has been successfully created.',
    type: FtTeamRequestResponseDto,
    isArray: true,
  })
  async create(
    @Body() createFtTeamRequestDto: CreateFtTeamRequestDto[],
    @Param('ftId', ParseIntPipe) ftId: number,
    @Param('twId', ParseIntPipe) twId: number,
  ): Promise<FtTeamRequestResponseDto[]> {
    return this.ftTeamRequestService.create(createFtTeamRequestDto, ftId, twId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Delete(':ftId/time-windows/:twId/team-requests')
  @HttpCode(204)
  @ApiBody({
    description: 'The team request to delete',
    type: DeleteFtTeamRequestDto,
  })
  @ApiResponse({
    status: 204,
    description: 'The team request has been successfully deleted.',
  })
  remove(
    @Body() deleteFtTeamRequest: DeleteFtTeamRequestDto,
    @Param('ftId', ParseIntPipe) ftId: number,
    @Param('twId', ParseIntPipe) twId: number,
  ) {
    return this.ftTeamRequestService.remove(deleteFtTeamRequest, ftId, twId);
  }
}
