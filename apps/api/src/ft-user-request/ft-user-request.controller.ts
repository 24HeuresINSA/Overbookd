import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { FtUserRequestDto } from "./dto/ft-user-request.request.dto";
import { FtUserRequestResponseDto } from "./dto/ft-user-request.response.dto";
import { FtUserRequestService } from "./ft-user-request.service";
import { WRITE_FT } from "@overbookd/permission";

@ApiBearerAuth()
@ApiTags("ft")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiNotFoundResponse({
  description: "Resource not found",
})
@Controller("ft")
export class FtUserRequestController {
  constructor(private readonly ftUserRequestService: FtUserRequestService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Post("/:ftId/time-windows/:twId/user-requests")
  @ApiResponse({
    status: 201,
    description: "The user request has been successfully created.",
    type: FtUserRequestResponseDto,
    isArray: true,
  })
  @ApiBody({
    description: "All of the user requests to create",
    type: FtUserRequestDto,
    isArray: true,
  })
  async create(
    @Body() requests: FtUserRequestDto[],
    @Param("twId", ParseIntPipe) twId: number,
  ): Promise<FtUserRequestResponseDto[]> {
    return this.ftUserRequestService.create(requests, twId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Delete("/:ftId/time-windows/:twId/user-requests/:userId")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "The user requests have been successfully deleted.",
  })
  async delete(
    @Param("twId", ParseIntPipe) twId: number,
    @Param("userId", ParseIntPipe) userId: number,
  ): Promise<void> {
    return this.ftUserRequestService.delete(twId, userId);
  }
}
