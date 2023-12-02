import { Injectable } from "@nestjs/common";
import { Signage, SignageForm } from "@overbookd/signa";

export interface CatalogSignageRepository {
  findAll(): Promise<Signage[]>;
  create(signage: SignageForm): Promise<Signage>;
  update(id: number, signage: SignageForm): Promise<Signage>;
  remove(id: number): Promise<void>;
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

}
