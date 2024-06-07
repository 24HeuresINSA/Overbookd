import { BadRequestException } from "@nestjs/common";
import { CatalogCategory, CatalogGear } from "@overbookd/http";

export class GearAlreadyExists extends BadRequestException {
  gear: Pick<CatalogGear, "name">;
  constructor(gear: Pick<CatalogGear, "name">) {
    super(`"${gear.name}" gear already exists`);
    this.gear = gear;
  }
}

export class CategoryAlreadyExists extends BadRequestException {
  category: Pick<CatalogCategory, "name">;
  constructor(category: Pick<CatalogCategory, "name">) {
    super(`"${category.name}" category already exists`);
    this.category = category;
  }
}
