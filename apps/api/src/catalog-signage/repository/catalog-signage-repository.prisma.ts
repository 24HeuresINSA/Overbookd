import { Signage, SignageError, SignageForm } from "@overbookd/signa";
import { FileService } from "../../user/file.service";
import { PrismaService } from "../../prisma.service";
import { CatalogSignageRepository } from "../catalog-signage.service";
import { SlugifyService } from "@overbookd/slugify";
import { StreamableFile } from "@nestjs/common";

export class PrismaCatalogSignageRepository implements CatalogSignageRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}
  
  async findAll(): Promise<Signage[]> {
    return this.prisma.catalogSignage.findMany();
  }

  async create(signage: SignageForm): Promise<Signage> {
    const slug = SlugifyService.apply(signage.name);
    const existing = await this.prisma.catalogSignage.findFirst({
      where: { slug },
    });
    if (existing) {
      throw new SignageError("La signalisation avec ce nom existe déjà");
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
    const signage = await this.prisma.catalogSignage.findUnique({
      where: { id },
    });
    if (signage?.image) {
      this.fileService.deleteFile(signage.image);
    }
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
      throw new SignageError("La signalisation n'existe pas");
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
    if (!signage?.image) return;

    await this.fileService.deleteFile(signage.image);
    await this.prisma.catalogSignage.update({
      where: { id },
      data: { image: null },
    });
  }

  async streamSignageImage(id: number): Promise<StreamableFile> {
    const image = await this.findSignageImage(id);
    if (!image) {
      throw new SignageError("L'image n'a pas été trouvée");
    }
    return this.fileService.streamFile(image);
  }
}
