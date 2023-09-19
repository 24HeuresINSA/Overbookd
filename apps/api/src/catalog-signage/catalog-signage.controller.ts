import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { CatalogSignageService } from "./catalog-signage.service";
import { READ_SIGNAGE_CATALOG, WRITE_SIGNAGE_CATALOG } from "@overbookd/permission";
import { SignageResponseDto } from "./dto/signage.reponse";
import { Signage } from "@overbookd/signa";
import { CreateSignageRequestDto } from "./dto/create-signage.request";
import { UpdateSignageRequestDto } from "./dto/update-signage.request";

@ApiBearerAuth()
@ApiTags("catalog-signage")
@Controller("catalog-signage")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
export class CatalogSignageController {
  constructor(private readonly catalogSignageService: CatalogSignageService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_SIGNAGE_CATALOG)
  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all signage items in catalog",
    type: SignageResponseDto,
    isArray: true,
  })
  findAll(): Promise<Signage[]> {
    return this.catalogSignageService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_SIGNAGE_CATALOG)
  @Post()
  @ApiBody({
    description: "The signage to create",
    type: CreateSignageRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: "The signage has been successfully created",
    type: SignageResponseDto,
  })
  create(signage: CreateSignageRequestDto): Promise<Signage> {
    return this.catalogSignageService.create(signage);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_SIGNAGE_CATALOG)
  @Put()
  @ApiBody({
    description: "The signage to update",
    type: UpdateSignageRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: "The signage has been successfully updated",
    type: SignageResponseDto,
  })
  update(signage: UpdateSignageRequestDto): Promise<Signage> {
    return this.catalogSignageService.update(signage);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_SIGNAGE_CATALOG)
  @Delete(":id")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "The signage has been successfully deleted",
  })
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.catalogSignageService.remove(id);
  }
}
