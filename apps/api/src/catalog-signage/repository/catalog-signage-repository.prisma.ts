import { Signage, SignageForm } from "@overbookd/signa";
import { FileService } from "../../user/file.service";
import { PrismaService } from "../../prisma.service";
import { CatalogSignageRepository } from "../catalog-signage.service";
import { SlugifyService } from "@overbookd/slugify";
import { StreamableFile } from "@nestjs/common";

export class CatalogSignageError extends Error {}

export class PrismaCatalogSignageRepository implements CatalogSignageRepository {
  private readonly fileService: FileService;

  constructor(
    private readonly prisma: PrismaService,
    fileService: FileService, 
  ) {
    this.fileService = fileService;
  }
  async findAll(): Promise<Signage[]> {
    return this.prisma.catalogSignage.findMany();
  }

  async create(signage: SignageForm): Promise<Signage> {
    const slug = SlugifyService.apply(signage.name);
    const existing = await this.prisma.catalogSignage.findFirst({
      where: { slug },
    });
    if (existing) {
      throw new CatalogSignageError("La signalisation avec ce nom existe déjà");
    }
    return this.prisma.catalogSignage.create({
      data: { ...signage, slug },
    });
  }

  async update(id: number, signage: SignageForm): Promise<Signage> {
    const slug = SlugifyService.apply(signage.name);
    return this.prisma.catalogSignage.update({
      where: { id },
      data: { ...signage, slug },
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.catalogSignage.delete({ where: { id } });
  }

  async findSignageImage(id: number): Promise<string | null> {
    const { image } = await this.prisma.catalogSignage.findUnique({
      where: { id },
      select: { image: true },
    });
    return image;
  }
  async uploadImage(id: number, image: string): Promise<Signage> {
    const signage = await this.prisma.catalogSignage.findUnique({
      where: { id },
    });
    if (!signage) {
      throw new CatalogSignageError("La signalisation n'existe pas");
    }
    const { image: currentImage } = signage;
    if (currentImage) {
      this.fileService.deleteFile(currentImage);
    }
    return this.prisma.catalogSignage.update({
      where: { id },
      data: { ...signage, image: image.toString() },
    });
  }


  async deleteImage(id: number): Promise<void> {
    const signage = await this.prisma.catalogSignage.findUnique({
      where: { id },
    });
    if (!signage) {
      throw new CatalogSignageError("La signalisation n'existe pas");
    }
    if (!signage.image) {
      throw new CatalogSignageError("La signalisation n'a pas d'image");
    }
    await this.fileService.deleteFile(signage.image);
    await this.prisma.catalogSignage.update({
      where: { id },
      data: { image: null },
    });
  }

  async streamSignageImage(id: number): Promise<StreamableFile> {
    const image = await this.findSignageImage(id);
    if (!image) {
      throw new CatalogSignageError("La signalisation n'a pas d'image");
    }
    return this.fileService.streamFile(image);
  }
}
