import {
  Body,
  Controller,
  Delete,
  Get,
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
import { FaSignaNeedService } from "./fa-signa-need.service";
import { FaSignaNeedResponseDto } from "./dto/fa-signa-need.response.dto";
import { UpsertFaSignaNeedRequestDto } from "./dto/upsert-fa-signa-need.request.dto";
import { ExportSignaNeed, FaSignaNeed } from "./fa-signa-need.model";
import { FaSignaNeedExportCsvResponseDto } from "./dto/fa-signa-need-export-csv.response.dto";

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
export class FaSignaNeedController {
  constructor(private readonly faSignaNeedService: FaSignaNeedService) {}

  @Permission("hard")
  @Post(":faId/signa-need")
  @ApiResponse({
    status: 201,
    description: "The fa signa need have been successfully upserted.",
    type: FaSignaNeedResponseDto,
    isArray: true,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "FA id",
    required: true,
  })
  @ApiBody({
    type: UpsertFaSignaNeedRequestDto,
    description: "FA signa need to upsert",
  })
  upsert(
    @Param("faId", ParseIntPipe) faId: number,
    @Body() signaNeed: UpsertFaSignaNeedRequestDto,
  ): Promise<FaSignaNeed> {
    return this.faSignaNeedService.upsert(faId, signaNeed);
  }

  @Permission("hard")
  @Delete(":faId/signa-need/:id")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "The fa signa need have been successfully deleted.",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "FA signa need id",
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
    return this.faSignaNeedService.remove(faId, id);
  }

  @Permission("hard")
  @Get("signa-need/export-csv")
  @ApiResponse({
    status: 200,
    description: "All signa needs for export",
    type: FaSignaNeedExportCsvResponseDto,
    isArray: true,
  })
  findSignaNeedsForExport(): Promise<ExportSignaNeed[]> {
    return this.faSignaNeedService.findSignaNeedsForExport();
  }
}
