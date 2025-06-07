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
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { CharismaPeriodService } from "./charisma-period.service";
import { CharismaPeriodResponseDto } from "./dto/charisma-period.response.dto";
import { CreateCharismaPeriodRequestDto } from "./dto/create-charisma-period.request.dto";
import { UpdateCharismaPeriodRequestDto } from "./dto/update-charisma-period.request.dto";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags("charisma-periods")
@Controller("charisma-periods")
@ApiSwaggerResponse()
export class CharismaPeriodController {
  constructor(private readonly charismaPeriodService: CharismaPeriodService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all Charisma Period",
    isArray: true,
    type: CharismaPeriodResponseDto,
  })
  findAll(): Promise<CharismaPeriodResponseDto[]> {
    return this.charismaPeriodService.findAllCharismaPeriods();
  }

  @Get(":id")
  @ApiResponse({
    status: 200,
    description: "Get one Charisma Period",
    type: CharismaPeriodResponseDto,
  })
  @ApiParam({
    name: "id",
    description: "Charisma Period id",
    type: Number,
  })
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<CharismaPeriodResponseDto> {
    return this.charismaPeriodService.findOneCharismaPeriod(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @ApiResponse({
    status: 201,
    description: "The Charisma Period has been successfully created.",
    type: CharismaPeriodResponseDto,
  })
  @ApiBody({
    description: "Charisma Period to create",
    type: CreateCharismaPeriodRequestDto,
  })
  create(
    @Body() charismaPeriod: CreateCharismaPeriodRequestDto,
  ): Promise<CharismaPeriodResponseDto> {
    return this.charismaPeriodService.createCharismaPeriod(charismaPeriod);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "The Charisma Period has been successfully updated.",
    type: CharismaPeriodResponseDto,
  })
  @ApiParam({
    name: "id",
    description: "Charisma Period id",
    type: Number,
  })
  @ApiBody({
    description: "Charisma Period to update",
    type: UpdateCharismaPeriodRequestDto,
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() charismaPeriod: UpdateCharismaPeriodRequestDto,
  ): Promise<CharismaPeriodResponseDto> {
    return this.charismaPeriodService.updateCharismaPeriod(id, charismaPeriod);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(AFFECT_VOLUNTEER)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "The Charisma Period has been successfully deleted.",
  })
  @ApiParam({
    name: "id",
    description: "Charisma Period id",
    type: Number,
  })
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.charismaPeriodService.deleteCharismaPeriod(id);
  }
}
