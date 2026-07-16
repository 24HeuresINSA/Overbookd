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
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Permissions } from "../authentication-zitadel/decorators/permissions-auth.decorator";
import { CreateLocationRequestDto } from "./dto/create-location.request.dto";
import { UpdateLocationRequestDto } from "./dto/update-location.request.dto";
import { LocationService } from "./location.service";
import { LocationRequestDto } from "./dto/location.request.dto.";
import { MANAGE_LOCATION, VIEW_LOCATION } from "@overbookd/permission";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@Controller("locations")
@ApiTags("locations")
@ApiBearerAuth()
@ApiSwaggerResponse()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @Permissions(MANAGE_LOCATION)
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
  @Permissions(VIEW_LOCATION)
  @ApiResponse({
    status: 200,
    isArray: true,
    type: LocationRequestDto,
  })
  findAll() {
    return this.locationService.findAll();
  }

  @Get(":id")
  @Permissions(VIEW_LOCATION)
  @ApiResponse({
    status: 200,
    type: LocationRequestDto,
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.locationService.findOne(id);
  }

  @Put(":id")
  @Permissions(MANAGE_LOCATION)
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
  @Permissions(MANAGE_LOCATION)
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.locationService.remove(id);
  }
}
