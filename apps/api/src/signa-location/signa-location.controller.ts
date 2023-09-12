import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { CreateSignaLocationRequestDto } from "./dto/create-signa-location.request.dto";
import { UpdateSignaLocationRequestDto } from "./dto/update-signa-location.request.dto";
import { SignaLocationService } from "./signa-location.service";
import { SignaLocationRepresentation } from "../fa/fa.model";
import { MANAGE_LOCATION, READ_FA } from "@overbookd/permission";

@ApiBearerAuth()
@ApiTags("signa-location")
@Controller("signa-location")
export class SignaLocationController {
  constructor(private readonly signaLocationService: SignaLocationService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_LOCATION)
  @Post()
  @ApiBody({
    type: CreateSignaLocationRequestDto,
  })
  @ApiResponse({
    status: 201,
    type: SignaLocationRepresentation,
  })
  create(@Body() createSignaLocationDto: CreateSignaLocationRequestDto) {
    return this.signaLocationService.create(createSignaLocationDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get()
  @ApiResponse({
    status: 200,
    isArray: true,
    type: SignaLocationRepresentation,
  })
  findAll() {
    return this.signaLocationService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get(":id")
  @ApiResponse({
    status: 200,
    type: SignaLocationRepresentation,
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.signaLocationService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_LOCATION)
  @Patch(":id")
  @ApiResponse({
    status: 200,
    type: SignaLocationRepresentation,
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSignaLocationDto: UpdateSignaLocationRequestDto,
  ) {
    return this.signaLocationService.update(id, updateSignaLocationDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(MANAGE_LOCATION)
  @Delete(":id")
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.signaLocationService.remove(id);
  }
}
