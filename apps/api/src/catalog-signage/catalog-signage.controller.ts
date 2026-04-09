import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  StreamableFile,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  READ_SIGNAGE_CATALOG,
  WRITE_SIGNAGE_CATALOG,
} from "@overbookd/permission";
import { Signage } from "@overbookd/signa";
import { ApiSwaggerResponse } from "../api-swagger-response.decorator";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { FileUploadRequestDto } from "../user/dto/file-upload.request.dto";
import { ImageInterceptor } from "../utils/image.interceptor";
import { CatalogSignageErrorFilter } from "./catalog-signage.filter";
import { CatalogSignageService } from "./catalog-signage.service";
import { SignageFormRequestDto } from "./dto/signage-form.request";
import { SignageResponseDto } from "./dto/signage.response";

@Controller("signages")
@ApiTags("signages")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseFilters(CatalogSignageErrorFilter)
@ApiSwaggerResponse()
export class CatalogSignageController {
  constructor(private readonly catalogSignageService: CatalogSignageService) {}

  @Get()
  @Permission(READ_SIGNAGE_CATALOG)
  @ApiResponse({
    status: 200,
    description: "Get all signage items in catalog",
    type: SignageResponseDto,
    isArray: true,
  })
  findAll(): Promise<Signage[]> {
    return this.catalogSignageService.findAll();
  }

  @Post()
  @Permission(WRITE_SIGNAGE_CATALOG)
  @ApiBody({
    description: "The signage to create",
    type: SignageFormRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: "The signage has been successfully created",
    type: SignageResponseDto,
  })
  create(@Body() signage: SignageFormRequestDto): Promise<Signage> {
    return this.catalogSignageService.create(signage);
  }

  @Put(":id")
  @Permission(WRITE_SIGNAGE_CATALOG)
  @ApiBody({
    description: "The signage to update",
    type: SignageFormRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: "The signage has been successfully updated",
    type: SignageResponseDto,
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() signage: SignageFormRequestDto,
  ): Promise<Signage> {
    return this.catalogSignageService.update(id, signage);
  }

  @Delete(":id")
  @Permission(WRITE_SIGNAGE_CATALOG)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "The signage has been successfully deleted",
  })
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.catalogSignageService.remove(id);
  }

  @Post(":id/image")
  @Permission(WRITE_SIGNAGE_CATALOG)
  @UseInterceptors(ImageInterceptor("file"))
  @ApiResponse({
    status: 201,
    description: "Add an image to a signage",
    type: SignageResponseDto,
  })
  @ApiBody({
    description: "Profile picture file",
    type: FileUploadRequestDto,
  })
  defineSignageImage(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
    file: Express.Multer.File,
  ): Promise<Signage> {
    return this.catalogSignageService.updateSignageImage(id, file.filename);
  }

  @Get(":id/image")
  @Permission(READ_SIGNAGE_CATALOG)
  @ApiResponse({
    status: 200,
    description: "Get signage image",
    type: SignageResponseDto,
  })
  async getSignageImage(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<StreamableFile | null> {
    return this.catalogSignageService.streamSignageImage(id);
  }
}
