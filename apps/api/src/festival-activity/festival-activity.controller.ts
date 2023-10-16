import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { FestivalActivityService } from "./festival-activity.service";
import { READ_FA, WRITE_FA } from "@overbookd/permission";
import {
  FestivalActivity,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { PreviewFestivalActivityResponseDto } from "./dto/preview-festival-activity.reponse.dto";
import { Permission } from "../authentication/permissions-auth.decorator";

@ApiBearerAuth()
@ApiTags("festival-activity")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller("festival-activity")
export class FestivalActivityController {
  constructor(
    private readonly festivalActivityService: FestivalActivityService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get()
  @ApiResponse({
    status: 201,
    description: "All festival activities",
    type: PreviewFestivalActivityResponseDto,
    isArray: true,
  })
  findAll(): Promise<PreviewFestivalActivity[]> {
    return this.festivalActivityService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get(":id")
  @ApiResponse({
    status: 201,
    description: "A festival activity",
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  findById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<FestivalActivity | null> {
    return this.festivalActivityService.findById(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Put()
  @ApiResponse({
    status: 201,
    description: "A festival activity",
  })
  @ApiBody({
    description: "Festival activity to save",
  })
  save(@Body() festivalActivity: FestivalActivity): Promise<FestivalActivity> {
    return this.festivalActivityService.save(festivalActivity);
  }
}
