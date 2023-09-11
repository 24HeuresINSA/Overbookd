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
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { FaElectricityNeedService } from "./fa-electricity-need.service";
import { FaElectricityNeedResponseDto } from "./dto/fa-electricity-need.response.dto";
import { UpsertFaElectricityNeedRequestDto } from "./dto/upsert-fa-electricity-need.request.dto";
import { FaElectricityNeed } from "./fa-electricity-need.model";

@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@ApiTags("fa")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller("fa")
export class FaElectricityNeedController {
  constructor(
    private readonly faElectricityNeedService: FaElectricityNeedService,
  ) {}

  @Permission("write-fa")
  @Post(":faId/electricity-need")
  @ApiResponse({
    status: 201,
    description: "The fa electricity need have been successfully upserted.",
    type: FaElectricityNeedResponseDto,
    isArray: true,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "FA id",
    required: true,
  })
  @ApiBody({
    type: UpsertFaElectricityNeedRequestDto,
    description: "FA electricity need to upsert",
  })
  upsert(
    @Param("faId", ParseIntPipe) faId: number,
    @Body() electricityNeed: UpsertFaElectricityNeedRequestDto,
  ): Promise<FaElectricityNeed> {
    return this.faElectricityNeedService.upsert(faId, electricityNeed);
  }

  @Permission("write-fa")
  @Delete(":faId/electricity-need/:id")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "The fa electricity need have been successfully deleted.",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "FA electricity need id",
    required: true,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "FA id",
    required: true,
  })
  remove(
    @Param("faId", ParseIntPipe) faId: number,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<void> {
    return this.faElectricityNeedService.remove(faId, id);
  }
}
