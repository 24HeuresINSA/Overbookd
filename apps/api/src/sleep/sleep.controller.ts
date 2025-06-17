import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SleepService } from "./sleep.service";
import {
  AboutBedRequestDto,
  SleeperRequestDto,
  UpdateBedRequestDto,
} from "./dto/sleep.request.dto";
import {
  BedResponseDto,
  EmptyBedResponseDto,
  OccupiedBedResponseDto,
} from "./dto/sleep.response.dto";
import { EmptyBed, OccupiedBed, Bed } from "@overbookd/sleep";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { MANAGE_SLEEP_ROOMS } from "@overbookd/permission";
import { Permission } from "../authentication/permissions-auth.decorator";

@ApiTags("sleep")
@Controller("sleep")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class SleepController {
  constructor(private readonly sleepService: SleepService) {}

  @Permission(MANAGE_SLEEP_ROOMS)
  @Get()
  getAll(): Promise<BedResponseDto[]> {
    return this.sleepService.findAll();
  }

  @Permission(MANAGE_SLEEP_ROOMS)
  @Put(":id")
  updateBed(
    @Param("id", ParseIntPipe) bedId: Bed["id"],
    @Body() { bed, sleeper }: UpdateBedRequestDto,
  ): Promise<EmptyBedResponseDto> {
    return this.sleepService.editBed(bedId, bed, sleeper);
  }

  @Permission(MANAGE_SLEEP_ROOMS)
  @Post()
  createBed(@Body() bed: AboutBedRequestDto): Promise<EmptyBedResponseDto> {
    return this.sleepService.createBed(bed);
  }

  @Permission(MANAGE_SLEEP_ROOMS)
  @Post("batch")
  createBedBatch(
    @Body() beds: AboutBedRequestDto[],
  ): Promise<EmptyBedResponseDto[]> {
    return this.sleepService.createBedBatch(beds);
  }

  @Permission(MANAGE_SLEEP_ROOMS)
  @Post("wakeup/:id")
  wakeup(
    @Param("id", ParseIntPipe) bedId: OccupiedBed["id"],
  ): Promise<EmptyBedResponseDto> {
    return this.sleepService.wakeup(bedId);
  }

  @Permission(MANAGE_SLEEP_ROOMS)
  @Delete(":id")
  @HttpCode(204)
  deleteBed(@Param("id", ParseIntPipe) bedId: EmptyBed["id"]): Promise<void> {
    return this.sleepService.deleteBed(bedId);
  }

  @Permission(MANAGE_SLEEP_ROOMS)
  @Post("rest/:id")
  sendToBed(
    @Param("id", ParseIntPipe) bedId: EmptyBed["id"],
    @Body() sleeper: SleeperRequestDto,
  ): Promise<OccupiedBedResponseDto> {
    return this.sleepService.assignBedToSleeper(bedId, sleeper);
  }
}
