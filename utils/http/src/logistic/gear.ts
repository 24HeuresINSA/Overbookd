import { CatalogCategoryIdentifier, CategoryOwner } from "./catalog.js";

export type GearSearchOptions = {
  search?: string;
  category?: string;
  owner?: string;
  ponctualUsage?: boolean;
};

export type CatalogGear = {
  id: number;
  name: string;
  isPonctualUsage: boolean;
  isConsumable: boolean;
  slug: string;
  owner?: CategoryOwner;
  category?: CatalogCategoryIdentifier;
  code?: string;
};

export type CatalogGearForm = {
  name: string;
  category?: number;
  isPonctualUsage: boolean;
  isConsumable: boolean;
};
