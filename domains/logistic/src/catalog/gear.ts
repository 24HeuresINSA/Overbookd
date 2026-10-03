import { CatalogCategoryIdentifier, CategoryOwner } from "./category";

export type GearSearchOptions = {
  search?: string;
  category?: string;
  owner?: string;
  ponctualUsage?: boolean;
};

export type SavedCatalogGear = {
  id: number;
  name: string;
  isPonctualUsage: boolean;
  isConsumable: boolean;
  slug: string;
  owner?: CategoryOwner;
  category?: CatalogCategoryIdentifier;
};

export type CatalogGear = SavedCatalogGear & {
  code?: string;
};

export type GearLinkedItems = {
  tasks: number[];
  activities: number[];
  borrows: number[];
};
