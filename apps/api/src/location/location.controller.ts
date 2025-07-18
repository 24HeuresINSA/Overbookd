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
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { CreateLocationRequestDto } from "./dto/create-location.request.dto";
import { UpdateLocationRequestDto } from "./dto/update-location.request.dto";
import { LocationService } from "./location.service";
import { LocationRequestDto } from "./dto/location.request.dto.";
import { MANAGE_LOCATION, VIEW_LOCATION } from "@overbookd/permission";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@Controller("locations")
@ApiTags("locations")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiSwaggerResponse()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @Permission(MANAGE_LOCATION)
  @ApiBody({
    type: CreateLocationRequestDto,
  })
  @ApiResponse({
    status: 201,
    type: LocationRequestDto,
  })
  create(@Body() location: CreateLocationRequestDto) {
    return this.locationService.create(location);
  }

  @Get()
  @Permission(VIEW_LOCATION)
  @ApiResponse({
    status: 200,
    isArray: true,
    type: LocationRequestDto,
  })
  findAll() {
    return this.locationService.findAll();
  }

  @Get(":id")
  @Permission(VIEW_LOCATION)
  @ApiResponse({
    status: 200,
    type: LocationRequestDto,
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.locationService.findOne(id);
  }

  @Put(":id")
  @Permission(MANAGE_LOCATION)
  @ApiResponse({
    status: 200,
    type: LocationRequestDto,
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() location: UpdateLocationRequestDto,
  ) {
    return this.locationService.update(id, location);
  }

  @Delete(":id")
  @Permission(MANAGE_LOCATION)
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.locationService.remove(id);
  }
}
