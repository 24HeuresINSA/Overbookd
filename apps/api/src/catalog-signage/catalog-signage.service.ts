import { Injectable, StreamableFile } from "@nestjs/common";
import { Signage, SignageForm } from "@overbookd/signa";

export interface CatalogSignageRepository {
  findAll(): Promise<Signage[]>;
  create(signage: SignageForm): Promise<Signage>;
  update(id: number, signage: SignageForm): Promise<Signage>;
  remove(id: number): Promise<void>;
  uploadImage(id: number, image: string): Promise<Signage>;
  findSignageImage(id: number): Promise<string | null>;
  streamSignageImage(id: number): Promise<StreamableFile>;
}

@Injectable()
export class CatalogSignageService {
  constructor(private readonly catalogSignages: CatalogSignageRepository) {}

  async findAll(): Promise<Signage[]> {
    return this.catalogSignages.findAll();
  }

  async create(signage: SignageForm): Promise<Signage> {
    return this.catalogSignages.create(signage);
  }

  async update(id: number, signage: SignageForm): Promise<Signage> {
    return this.catalogSignages.update(id, signage);
  }

  async remove(id: number): Promise<void> {
    await this.catalogSignages.remove(id);
  }
  private async getSignageImage(id: number): Promise<string | null> {
   return this.catalogSignages.findSignageImage(id);
  }

  async updateSignageImage(id: number, image: string): Promise<Signage> {
    return this.catalogSignages.uploadImage(id, image);
  }

  async streamSignageImage(id: number): Promise<StreamableFile> {
    return this.catalogSignages.streamSignageImage(id);
  }
}
