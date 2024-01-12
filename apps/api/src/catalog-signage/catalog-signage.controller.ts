import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  UseGuards,
  UseFilters,
  UseInterceptors,
  StreamableFile,
  UploadedFile,
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
import {
  READ_SIGNAGE_CATALOG,
  WRITE_SIGNAGE_CATALOG,
} from "@overbookd/permission";
import { diskStorage } from "multer";
import { randomUUID } from "crypto";
import { SignageResponseDto } from "./dto/signage.response";
import { Signage } from "@overbookd/signa";
import { SignageFormRequestDto } from "./dto/signage-form.request";
import { CatalogSignageErrorFilter } from "./catalog-signage.filter";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { join } from "path";
import { FileUploadRequestDto } from "../user/dto/file-upload.request.dto";

@ApiBearerAuth()
@ApiTags("signages")
@Controller("signages")
@UseFilters(CatalogSignageErrorFilter)
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_SIGNAGE_CATALOG)
  @Put(":id")
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

  @UseGuards(JwtAuthGuard)
  @Permission(WRITE_SIGNAGE_CATALOG)
  @Post(":id/image")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: join(process.cwd(), "public"),
        filename: (req, file, cb) => {
          const uuid = randomUUID();
          const filenameFragments = file.originalname.split(".");
          const extension = filenameFragments.at(-1) ?? "jpg";
          cb(null, `${uuid}.${extension}`);
        },
      }),
    }),
  )
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
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Signage> {
    return this.catalogSignageService.updateSignageImage(id, file.filename);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_SIGNAGE_CATALOG)
  @Get(":id/image")
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
